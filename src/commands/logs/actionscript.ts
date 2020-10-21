import {Command, flags} from '@oclif/command'
import EventSource from 'eventsource'
import Conf from 'conf'

const config = new Conf()

export default class Logs extends Command {
  static description = 'get logs from actionscript'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'channel'}]

  async run() {
    const {args} = this.parse(Logs)
    const {channel} = args

    const currentContext = config.get('current-context')
    const sseUrl = config.get(`contexts.${currentContext}.sse`)

    // TODO: empty currentContext, sseUrl

    const url = `${sseUrl}/sse?channel=${channel}`
    const source = new EventSource(url)
    this.log('Listening for logs...')
    source.addEventListener('log_actionscript', (event: Event) => {
      this.log(JSON.parse((event as MessageEvent).data).message)
    })
    source.addEventListener('error', (error: Event) => {
      throw error
    })
  }
}
