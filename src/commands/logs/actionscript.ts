import {flags} from '@oclif/command'
import EventSource from 'eventsource'
import chalk from 'chalk'
import BaseWithContext from '../../base-with-context'

export default class LogsActionscript extends BaseWithContext {
  static description = 'get logs from actionscript'

  static flags = {
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

    const sseServer = this.getSSE()
    const url = `${sseServer}/sse?channel=${channel}`
    const source = new EventSource(url)
    this.log(`Listening for logs on ${chalk.cyan(sseServer)}...`)

    source.addEventListener('log_actionscript', (event: Event) => {
      this.log(JSON.parse((event as MessageEvent).data).message)
    })
    source.addEventListener('error', (error: Event) => {
      throw error
    })
  }
}
