import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import cli from 'cli-ux'
import chalk from 'chalk'
import Conf from 'conf'
import download from 'download'
import BaseWithContext from '../../base-with-context'
import {GetTemplatesCategoryResponse} from '../../api/models/templates'

const config = new Conf()

export default class ProjectsBackup extends BaseWithContext {
  private questions = [
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

  static description = 'download template file'

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
    output: flags.string({char: 'o', description: 'output file'}),
  }

  static args = [
    {
      name: 'template_id',
      description: 'template_id from hexabase',
    },
  ]

  async run() {
    const {args, flags} = this.parse(ProjectsBackup)
    const noOutputFlag = typeof flags.output === 'undefined'

    try {
      if (!args.template_id) {
        const url = '/api/v0/templates'
        const {data: templates} = await this.hexaapi.get<GetTemplatesCategoryResponse>(url)

        if (templates.categories.length === 0) {
          return this.log(chalk.red('No template found'))
        }

        this.questions[0].choices = templates.categories.reduce((acc, ctg) => {
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
        const {template: template_id}: {template: string} = await prompt(this.questions[0])
        args.template_id = template_id
      }

      // specify filename
      if (noOutputFlag) {
        this.questions[1].initial = `${args.template_id}.zip`
        flags.output = await prompt(this.questions[1]).then(({output}: any) => output)
      }

      // download from apicore
      cli.action.start(`downloading template with tp_id ${chalk.cyan(args.template_id)}`)
      const url = `${this.context.server}/api/v0/templates/${args.template_id}/download`
      const token = config.get(`hexabase.${this.currentContext}.token`)
      const downloadOptions = {
        mode: '666',
        filename: flags.output,
        headers: {
          accept: 'application/zip',
          authorization: `Bearer ${token}`,
        },
      }
      await download(url, './', downloadOptions)
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
