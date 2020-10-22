import {Command, flags} from '@oclif/command'
import chalk from 'chalk'
import * as ws from '../../api/workspaces/workspaces'

export default class WorkspaceUse extends Command {
  static description = 'set current workspace in hexabase'

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
    const {args} = this.parse(WorkspaceUse)
    const result = await ws.select(args.workspaceId)
    if (result) {
      this.log(`Current-workspace successfully set to: ${chalk.cyan(args.workspaceId)}`)
    }
  }
}
