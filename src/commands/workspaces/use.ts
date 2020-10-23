import {Command, flags} from '@oclif/command'
import Conf from 'conf'
import chalk from 'chalk'
import * as ws from '../../api/workspaces/workspaces'

const config = new Conf()

export default class WorkspacesUse extends Command {
  static description = 'set current workspace in hexabase'

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
    const {args} = this.parse(WorkspacesUse)

    const currentContext = config.get('current-context')
    const apiServer = config.get(`contexts.${currentContext}.server`)

    if (!currentContext || !apiServer) {
      const output = []
      if (!currentContext) output.push(chalk.red('current-context'))
      if (!apiServer) output.push(chalk.red('server'))
      throw new Error(`Missing context settings: ${output.join(', ')}`)
    }

    const result = await ws.select(apiServer as string, args.workspaceId)
    if (result) {
      this.log(`Current-workspace successfully set to: ${chalk.cyan(args.workspaceId)}`)
    }
  }
}
