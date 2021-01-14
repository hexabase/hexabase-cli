import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import cli from 'cli-ux'
import chalk from 'chalk'
import * as tmp from '../../api/projects/templates'
import BaseWithContext from '../../base-with-context'

const questions = [
  {
    type: 'select',
    name: 'template',
    message: 'Select a template',
    choices: [],
  },
  {
    type: 'input',
    name: 'output',
    message: `Specify the ${chalk.cyan('output')} of the template file`,
    initial: '',
    validate: function (input: string) {
      if (input.length === 0) {
        return 'Cannot be empty'
      }
      return input.length !== 0
    },
  },
]

export default class ProjectsBackup extends BaseWithContext {
  static description = 'download template file'

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
    output: flags.string({char: 'o', description: 'output file'}),
  }

  static args = [
    {
      name: 'templateId',
      description: 'template_id from hexabase',
    },
  ]

  async run() {
    const {args, flags} = this.parse(ProjectsBackup)
    const noOutputFlag = typeof flags.output === 'undefined'

    try {
      if (!args.templateId) {
        const templateCategories = await tmp.get(this.currentContext)

        if (templateCategories.length === 0) {
          return this.log(chalk.red('No template found'))
        }

        questions[0].choices = templateCategories.reduce((acc, ctg) => {
          ctg.templates.forEach(tmp => {
            const elem = {
              name: tmp.tp_id,
              message: tmp.name,
              value: tmp.tp_id,
              hint: tmp.tp_id,
            } as never
            acc.push(elem)
          })
          return acc
        }, []) as never[]
        const {template: template_id}: {template: string} = await prompt(questions[0])
        args.templateId = template_id
      }

      // specify filename
      if (noOutputFlag) {
        questions[1].initial = `${args.templateId}.zip`
        flags.output = await prompt(questions[1]).then(({output}: any) => output)
      }

      // download from apicore
      cli.action.start(`downloading template with tp_id ${chalk.cyan(args.templateId)}`)
      await tmp.downloadTemplate(this.currentContext, args.templateId, flags.output!)
      cli.action.stop()
    } finally {
      if (noOutputFlag) {
        this.log(
          "You can specify the output file with the '--output' flag in the future"
        )
      }
    }
  }
}
