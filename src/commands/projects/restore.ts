import {flags} from '@oclif/command'
import {prompt}  from 'enquirer'
import cli from 'cli-ux'
import chalk from 'chalk'
import BaseWithContext from '../../base-with-context'
import * as tmp from '../../api/projects/templates'

const questions = [
  {
    type: 'input',
    name: 'pj_name',
    message: 'Please provide a name for your project',
    validate: function (input: string) {
      if (input.length === 0) {
        return 'Cannot be empty'
      }
      return input.length !== 0
    },
  },
]

export default class ProjectsRestore extends BaseWithContext {
  static description = 'restore a project from a template file'

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
    name: flags.string({char: 'n', description: 'name of the project to be restored'}),
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
        flags.name = await prompt(questions[0]).then(({pj_name}: any) => pj_name)
      }

      cli.action.start(`restoring template from file ${chalk.cyan(args.file)}`)
      await tmp.uploadTemplate(this.currentContext, flags.name!, args.file,)
      cli.action.stop()
    } finally {
      if (noNameFlag) {
        this.log(
          "You can specify the name of the project with the '--name' flag in the future"
        )
      }
    }
  }
}
