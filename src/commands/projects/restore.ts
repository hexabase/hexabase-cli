import {flags} from '@oclif/command'
import {prompt}  from 'enquirer'
import cli from 'cli-ux'
import chalk from 'chalk'
import BaseWithContext from '../../base-with-context'
import * as ws from '../../api/workspaces/workspaces'

const questions = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Please provide a name for your project',
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

export default class ProjectsRestore extends BaseWithContext {
  static description = 'restore a project from a template file'

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
        flags.name = await prompt(questions[0]).then(({projectName}: any) => projectName)
      }

      const workspaceResponse = await ws.get(this.currentContext)
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
        shouldProceed = await prompt(questions[1]).then(({confirm}: any) => confirm as boolean)
      }

      if (shouldProceed) {
        cli.action.start(`restoring template from file ${chalk.cyan(args.file)}`)
        // await tmp.uploadTemplate(this.currentContext, flags.name!, args.file)
        cli.action.stop()
      } else {
        this.log(chalk.red('restoring  aborted'))
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
