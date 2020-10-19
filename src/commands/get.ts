import {Command, flags} from '@oclif/command'
import * as ws from '../api/workspaces/workspaces'

export default class Get extends Command {
  static description = 'get resources from hexabase'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [
    {
      name: 'resource',
      options: ['workspaces'],
      required: true,
    },
  ]

  async run() {
    const {args} = this.parse(Get)
    let data
    switch (args.resource) {
    case 'workspaces':
      data = await ws.get()
    }
    this.log(data)
  }
}
