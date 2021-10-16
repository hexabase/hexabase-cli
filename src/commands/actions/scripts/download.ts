import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import cli from 'cli-ux'
import chalk from 'chalk'
import download from 'download'
import BaseWithContext from '../../../base-with-context'

export default class ActionsScriptDownload extends BaseWithContext {
  private questions = [
    {
      type: 'input',
      name: 'output',
      message: `Specify the ${chalk.cyan('output')} of the actionscript file`,
      initial: '',
      validate: function (input: string) {
        if (input.length === 0) {
          return 'Cannot be empty'
        }
        return input.length !== 0
      },
    },
  ]

  static description = 'download actionscript file'

  static aliases = ['scripts:download', 'as:get']

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
    type: flags.string({
      char: 't',
      description: 'script type',
      options: ['post', 'pre'],
      required: true,
    }),
    output: flags.string({char: 'o', description: 'output file'}),
  }

  static args = [
    {
      name: 'action_id',
      description: 'action_id from hexabase',
      required: true,
    },
  ]

  async run() {
    const {args, flags} = this.parse(ActionsScriptDownload)
    const noOutputFlag = typeof flags.output === 'undefined'

    try {
      // specify filename
      if (noOutputFlag) {
        this.questions[0].initial = `${flags.type}-${args.action_id}.js`
        flags.output = await prompt(this.questions[0]).then(({output}: any) => output)
      }

      // download from apicore
      cli.action.start(`Downloading ${flags.type}-script with action_id ${chalk.cyan(args.action_id)}`)
      const url = `${this.context.server}/api/v0/actions/${args.action_id}/actionscripts/download?script_type=${flags.type}`
      const token = this.hexaconfig.get(`hexabase.${this.currentContext}.token`)
      const downloadOptions = {
        mode: '666',
        filename: flags.output,
        headers: {
          accept: 'application/javascript',
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
