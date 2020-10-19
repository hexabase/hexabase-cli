import {Command, flags} from '@oclif/command'
import * as ws from '../../api/workspaces/workspaces'
import * as chalk from 'chalk'

export default class Select extends Command {
  static description = 'set current workspace'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [
    {
      name: 'resource',
      options: ['workspaces'],
      required: true,
    },
    {
      name: 'workspaceId',
      required: true,
    },
  ]

  async run() {
    const {args} = this.parse(Select)
    try {
      const result = await ws.select(args.workspaceId)
      if (result) {
        this.log(`Current workspace successfully changed to: ${chalk.green(args.workspaceId)}`)
      }
    } catch (error) {
      this.error(error)
    }
  }
}
