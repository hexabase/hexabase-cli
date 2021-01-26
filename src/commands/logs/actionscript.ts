import {flags} from '@oclif/command'
import chalk from 'chalk'
import BaseWithContext from '../../base-with-context'

export default class LogsActionscript extends BaseWithContext {
  static description = 'get logs from actionscript'

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
  }

  static args = [
    {
      name: 'channel',
      description: `input format: ${chalk.cyan('logs_<user_id>_<project_id>')}`,
      required: true,
    },
  ]

  async run() {
    const {args} = this.parse(LogsActionscript)
    const {channel} = args

    this.hexasse.connect(`/sse?channel=${channel}`)

    if (!this.hexasse.source) {
      throw new Error('could not establish connection')
    }

    this.log(`Listening for logs on ${chalk.cyan(this.hexasse.baseUrl)}...`)
    this.hexasse.source.addEventListener('log_actionscript', (event: Event) => {
      this.log(JSON.parse((event as MessageEvent).data).message)
    })
    this.hexasse.source.addEventListener('error', (error: Event) => {
      throw error
    })
  }
}
