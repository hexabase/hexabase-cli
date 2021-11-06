import {flags} from '@oclif/command'
import {cli} from 'cli-ux'
import chalk from 'chalk'
import BaseWithContext from '../../base-with-context'
import {GetWorkspacesResponse} from '../../api/models/workspaces'

export default class WorkspacesGet extends BaseWithContext {
  static description = 'get workspaces from hexabase'

  static aliases = ['ws', 'workspaces']

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(WorkspacesGet)

    const url = '/api/v0/workspaces'
    const {data: workspaceResponse} = await this.hexaAPI.get<GetWorkspacesResponse>(url)
    const currentWorkspace = workspaceResponse.workspaces.find((ws): boolean => {
      return ws.workspace_id === workspaceResponse.current_workspace_id
    })

    const columns = {
      workspace_id: {
        header: 'ID',
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
