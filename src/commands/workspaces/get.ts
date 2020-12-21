import {flags} from '@oclif/command'
import {cli} from 'cli-ux'
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

    const workspaces = await ws.get(this.getApiServer())
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
