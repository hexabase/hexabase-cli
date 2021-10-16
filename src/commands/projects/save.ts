import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import chalk from 'chalk'
import cli from 'cli-ux'
import download from 'download'
import BaseWithContext from '../../base-with-context'
import {Poller} from '../../helpers/poller'
import {GetCurrentWorkspaceResponse} from '../../api/models/workspaces'
import {GetProjectsElemResponse, CreateNewProjectTemplateData, CreateNewProjectTemplateResponse, TemplateForm} from '../../api/models/projects'
import {TasksObject} from '../../api/models/tasks'

export default class ProjectsSave extends BaseWithContext {
  private questions = [
    {
      type: 'select',
      name: 'project',
      message: 'Select a project',
      choices: [],
    },
    {
      type: 'form',
      name: 'templateForm',
      message: 'Please provide details for your project template',
      choices: [
        {name: 'name', message: 'Name', validate(value: string) {
          return value.length > 0
        }},
        {name: 'category', message: 'Category', validate(value: string) {
          return value.length > 0
        }},
        {name: 'description', message: 'Description'},
      ],
      validate(value: any) {
        return (value.name.length > 0 && value.category.length > 0) ? true : 'Cannot be empty'
      },
    },
    {
      type: 'toggle',
      name: 'includeHistories',
      message: 'Include histories',
      enabled: 'Yes',
      disabled: 'No',
    },
  ]

  static description = 'save template from a project'

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
    download: flags.string({
      char: 'd',
      description: 'downloaded output file (e.g. my_template.zip)',
    }),
  }

  static args = [
    {
      name: 'project_id',
      description: 'project_id from hexabase',
    },
  ]

  async run() {
    const {args, flags} = this.parse(ProjectsSave)

    if (!args.project_id) {
      let url = '/api/v0/workspacecurrent'
      const {data: currentWorkspace} = await this.hexaapi.get<GetCurrentWorkspaceResponse>(url)

      url = `/api/v0/workspaces/${currentWorkspace.workspace_id}/applications`
      const {data: projects} = await this.hexaapi.get<GetProjectsElemResponse[]>(url)

      if (projects.length === 0) {
        return this.log(chalk.red('No project found'))
      }

      this.questions[0].choices = projects.reduce((acc, pj) => {
        const elem = {
          name: pj.application_id,
          message: pj.name,
          value: pj.application_id,
          hint: pj.application_id,
        } as never
        acc.push(elem)
        return acc
      }, []) as never[]
      const {project: project_id}: {project: string} = await prompt(this.questions[0])
      args.project_id = project_id
    }

    const {templateForm}: {templateForm: TemplateForm} = await prompt(this.questions[1])
    this.log(`Name: ${chalk.cyan(templateForm.name)}`)
    this.log(`Category: ${chalk.cyan(templateForm.category)}`)
    if (templateForm.description !== '') {
      this.log(`Description: ${chalk.cyan(templateForm.description)}`)
    }
    const {includeHistories}: {includeHistories: boolean} = await prompt(this.questions[2])

    const newProjectReq: CreateNewProjectTemplateData = {
      project_id: args.project_id,
      include_histories: includeHistories,
      ...templateForm,
    }
    let url = '/api/v0/templates'
    const {data: template} = await this.hexaapi.post<CreateNewProjectTemplateResponse>(url, newProjectReq)

    cli.action.start('Task successfully queued')

    const poller = new Poller(-1) // wait until we get a response
    url = `/api/v0/tasks?category=SAVETEMPLATE&all=true&stream_id=${template.stream_id}`
    const fn = () => this.hexaapi.get<TasksObject>(url)
    const retryCondition = ({data}: {data: TasksObject}) => {
      const queueTask = data[Object.keys(data)[0]]
      // StatusQueued: 0, StatusProgress: 1, StatusDone: 2, StatusError: 3, StatusDead: 4
      return queueTask.status.id < 2
    }
    const {data} = await poller.poll(fn, retryCondition, 1000)
    cli.action.stop()
    const queueTask = data[Object.keys(data)[0]]

    let taskStatusMessage = ''
    switch (queueTask?.status?.id) {
    case 2:
      taskStatusMessage = `Template with tp_id ${chalk.cyan(template.tp_id)} successfully created`
      break
    case 3:
    case 4:
      throw new Error('Template creation unsuccessful')
    default:
      taskStatusMessage = 'Could not determine task status'
    }
    this.log(taskStatusMessage)

    // download from apicore
    if (flags.download) {
      cli.action.start(`Downloading template with tp_id ${chalk.cyan(template.tp_id)}`)
      url = `${this.context.server}/api/v0/templates/${args.template_id}/download`
      const token = this.hexaconfig.get(`hexabase.${this.currentContext}.token`)
      const downloadOptions = {
        mode: '666',
        filename: flags.download,
        headers: {
          accept: 'application/zip',
          authorization: `Bearer ${token}`,
        },
      }
      await download(url, './', downloadOptions)
      cli.action.stop()
    }
  }
}
