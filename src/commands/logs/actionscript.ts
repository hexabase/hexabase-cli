import {Command, flags} from '@oclif/command'
import {AnySoaRecord} from 'dns'
import EventSource from 'eventsource'

export default class Logs extends Command {
  static description = 'get logs from actionscript'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'channel'}]

  async run() {
    const {args} = this.parse(Logs)
    const {channel} = args

    const eventSourceInitDict = {}
    const url = `http://localhost:5002/sse?channel=${channel}`
    const source = new EventSource(url, eventSourceInitDict)
    source.addEventListener('log_actionscript', (event: Event) => {
      this.log(JSON.parse((event as MessageEvent).data).message)
    })
    source.addEventListener('error', (error: Event) => {
      throw error
    })
  }
}
