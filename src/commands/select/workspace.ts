import {Command, flags} from '@oclif/command'
import * as ws from '../../api/workspaces/workspaces'

export default class Select extends Command {
  static description = 'set current workspace'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [
    {
      name: 'workspaceId',
      required: true,
    },
  ]

  async run() {
    const {args} = this.parse(Select)
    try {
      await ws.select(args.workspaceId)
    } catch (error) {
      this.error(error)
    }
  }
}
