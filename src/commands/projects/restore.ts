import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import cli from 'cli-ux'
import chalk from 'chalk'
import fs from 'fs'
import FormData from 'form-data'
import BaseWithContext from '../../base-with-context'
import {GetWorkspacesResponse} from '../../api/models/workspaces'
import {UploadProjectTemplateResponse} from '../../api/models/projects'
import {Poller} from '../../helpers/poller'
import {TasksObject} from '../../api/models/tasks'

export default class ProjectsRestore extends BaseWithContext {
  private questions = [
    {
      type: 'input',
      name: 'projectName',
      message: 'Please provide the name for your project',
      validate: function (input: string) {
        if (input.length === 0) {
          return 'Cannot be empty'
        }
        return input.length !== 0
      },
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Do you want to proceed?',
    },
  ]

  static description = 'restore a project from a template file'

  static aliases = ['pj:restore']

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
    name: flags.string({char: 'n', description: 'name of the project to be restored'}),
    yes: flags.boolean({char: 'y', description: 'skip confirmation'}),
  }

  static args = [
    {
      name: 'file',
      description: 'zip file to be restored from, e.g. template.zip',
      required: true,
    },
  ]

  async run() {
    const {args, flags} = this.parse(ProjectsRestore)
    const noNameFlag = typeof flags.name === 'undefined'

    try {
      if (noNameFlag) {
        flags.name = await prompt(this.questions[0]).then(({projectName}: any) => projectName)
      }

      const url = '/api/v0/workspaces'
      const {data: workspaceResponse} = await this.hexaAPI.get<GetWorkspacesResponse>(url)
      const currentWorkspace = workspaceResponse.workspaces.find((ws): boolean => {
        return ws.workspace_id === workspaceResponse.current_workspace_id
      })

      let shouldProceed = false
      if (flags.yes) {
        shouldProceed = true
      } else {
        this.log(`You are about to restore the template to:
  workspace: ${chalk.cyan(currentWorkspace?.workspace_name)}
  context: ${chalk.cyan(this.currentContext)}`)
        shouldProceed = await prompt(this.questions[1]).then(({confirm}: any) => confirm as boolean)
      }

      if (shouldProceed) {
        cli.action.start(`Restoring template from file ${chalk.cyan(args.file)}`)
        const url = '/api/v0/templates/upload'
        const form = new FormData()
        form.append('file', fs.createReadStream(args.file))
        form.append('name', flags.name)

        const token = this.hexaConfig.get(`hexabase.${this.currentContext}.token`)
        const requestConfig = {
          headers: {
            authorization: `Bearer ${token}`,
            ...form.getHeaders(),
          },
        }

        const {data: template} = await this.hexaAPI.post<UploadProjectTemplateResponse>(url, form, requestConfig)

        cli.action.start('Task successfully queued')

        const poller = new Poller(-1) // wait until we get a response
        const tasksUrl = `/api/v0/tasks?category=UPLOADTEMPLATE&all=true&stream_id=${template.stream_id}`
        const fn = () => this.hexaAPI.get<TasksObject>(tasksUrl)
        const retryCondition = ({data}: {data: TasksObject}) => {
          const queueTask = data[Object.keys(data)[0]]
          // StatusQueued: 0, StatusProgress: 1, StatusDone: 2, StatusError: 3, StatusDead: 4
          return queueTask.status.id < 2
        }
        const { data } = await poller.poll(fn, retryCondition, 1000)
        cli.action.stop()
        const queueTask = data[Object.keys(data)[0]]

        let taskStatusMessage = ''
        switch (queueTask?.status?.id) {
          case 2:
            taskStatusMessage = `Template file successfully uploaded, project successfully restored`
            break
          case 3:
          case 4:
            throw new Error('Template uploading or project restoring unsuccessful')
          default:
            taskStatusMessage = 'Could not determine task status'
        }
        this.log(taskStatusMessage)
      } else {
        this.log(chalk.red('Restoring aborted'))
      }
    } finally {
      if (noNameFlag) {
        this.log(
          "You can specify the name of the project with the '--name' flag in the future"
        )
      }
    }
  }
}
