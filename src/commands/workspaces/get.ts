import {flags} from '@oclif/command'
import {cli} from 'cli-ux'
import chalk from 'chalk'
import * as ws from '../../api/workspaces/workspaces'
import BaseWithContext from '../../base-with-context'

export default class WorkspacesGet extends BaseWithContext {
  static description = 'get workspaces from hexabase'

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(WorkspacesGet)

    const workspaceResponse = await ws.get(this.currentContext)
    const currentWorkspace = workspaceResponse.workspaces.find((ws): boolean => {
      return ws.workspace_id === workspaceResponse.current_workspace_id
    })

    const columns = {
      workspace_id: {
        header: 'ID',
        minWidth: 30,
      },
      workspace_name: {
        header: 'NAME',
      },
    }

    cli.table(workspaceResponse.workspaces, columns, {
      printLine: this.log,
      ...flags,
    })
    if (!flags.output) {
      this.log(`Current-workspace set to: ${currentWorkspace ?
        chalk.cyan(currentWorkspace.workspace_name) :
        chalk.red('could not be determined')}`)
    }
  }
}
