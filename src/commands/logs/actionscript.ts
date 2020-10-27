import {Command, flags} from '@oclif/command'
import EventSource from 'eventsource'
import Conf from 'conf'
import chalk from 'chalk'

const config = new Conf()

// TODO: Create class for Commands with currentContext checking
export default class LogsActionscript extends Command {
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

    const currentContext = config.get('current-context')
    const sseServer = config.get(`contexts.${currentContext}.sse`)

    if (!currentContext || !sseServer) {
      const output = []
      if (!currentContext) output.push(chalk.red('current-context'))
      if (!sseServer) output.push(chalk.red('sse'))
      throw new Error(`Missing context settings: ${output.join(', ')}`)
    }

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
