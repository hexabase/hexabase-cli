import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import cli from 'cli-ux'
import chalk from 'chalk'
import fs from 'fs'
import FormData from 'form-data'
import BaseWithContext from '../../../base-with-context'

export default class ActionsScriptsUpload extends BaseWithContext {
  private questions = [
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Do you want to proceed?',
    },
  ]

  static description = 'upload actionscript file'

  static aliases = ['scripts:upload']

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
    type: flags.string({
      char: 't',
      description: 'script type',
      options: ['post', 'pre'],
      required: true,
    }),
    yes: flags.boolean({char: 'y', description: 'skip confirmation'}),
  }

  static args = [
    {
      name: 'action_id',
      description: 'action_id from hexabase',
      required: true,
    },
    {
      name: 'file',
      description: 'file to be uploaded, e.g. script.js',
      required: true,
    },
  ]

  async run() {
    const {args, flags} = this.parse(ActionsScriptsUpload)

    let shouldProceed = false
    if (flags.yes) {
      shouldProceed = true
    } else {
      this.log(`You are about to upload the script file to:
  action_id: ${chalk.cyan(args.action_id)}
  script_type: ${chalk.cyan(flags.type)}
  context: ${chalk.cyan(this.currentContext)}`)
      shouldProceed = await prompt(this.questions[0]).then(({confirm}: any) => confirm as boolean)
    }

    if (shouldProceed) {
      cli.action.start(`uploading ${flags.type}-script from file ${chalk.cyan(args.file)}`)
      const url = `/api/v0/actions/${args.action_id}/actionscripts/upload`
      const form = new FormData()
      form.append('file', fs.createReadStream(args.file))
      form.append('script_type', flags.type)

      const token = this.hexaconfig.get(`hexabase.${this.currentContext}.token`)
      const requestConfig = {
        headers: {
          authorization: `Bearer ${token}`,
          ...form.getHeaders(),
        },
      }
      await this.hexaapi.post(url, form, requestConfig)
      cli.action.stop()
    } else {
      this.log(chalk.red('uploading aborted'))
    }
  }
}
