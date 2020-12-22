import {flags} from '@oclif/command'
import chalk from 'chalk'
import BaseWithContext from '../../base-with-context'
import * as sse from '../../api/sse/sse'

export default class LogsActionscript extends BaseWithContext {
  static description = 'get logs from actionscript'

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
  }

  static args = [
    {
      name: 'channel',
      description: `input format: ${chalk.cyan('logs_<userId>_<projectId>')}`,
      required: true,
    },
  ]

  async run() {
    const {args} = this.parse(LogsActionscript)
    const {channel} = args

    const sseConnection = sse.connect(this.currentContext, channel)

    this.log(`Listening for logs on ${chalk.cyan(sseConnection.sseServer)}...`)

    sseConnection.source.addEventListener('log_actionscript', (event: Event) => {
      this.log(JSON.parse((event as MessageEvent).data).message)
    })
    sseConnection.source.addEventListener('error', (error: Event) => {
      throw error
    })
  }
}
