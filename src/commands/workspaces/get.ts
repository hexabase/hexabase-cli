import {Command, flags} from '@oclif/command'
import {cli} from 'cli-ux'
import Conf from 'conf'
import chalk from 'chalk'
import * as ws from '../../api/workspaces/workspaces'

const config = new Conf()

// TODO: Create class for Commands with currentContext checking
export default class WorkspacesGet extends Command {
  static description = 'get workspaces from hexabase'

  static flags = {
    help: flags.help({char: 'h'}),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(WorkspacesGet)

    const currentContext = config.get('current-context')
    const apiServer = config.get(`contexts.${currentContext}.server`)

    if (!currentContext || !apiServer) {
      const output = []
      if (!currentContext) output.push(chalk.red('current-context'))
      if (!apiServer) output.push(chalk.red('server'))
      throw new Error(`Missing context settings: ${output.join(', ')}`)
    }

    const workspaces = await ws.get(apiServer as string)
    const columns = {
      workspace_id: {
        header: 'ID',
        minWidth: 30,
      },
      workspace_name: {
        header: 'NAME',
      },
    }

    cli.table(workspaces, columns, {
      printLine: this.log,
      ...flags,
    })
  }
}
