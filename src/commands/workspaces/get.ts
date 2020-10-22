import {Command, flags} from '@oclif/command'
import {cli} from 'cli-ux'
import * as ws from '../../api/workspaces/workspaces'

export default class WorkspacesGet extends Command {
  static description = 'get workspaces from hexabase'

  static flags = {
    help: flags.help({char: 'h'}),
    ...cli.table.flags(),
  }

  static args = [
    {
      name: 'resource',
      options: ['workspaces'],
      required: true,
    },
  ]

  async run() {
    const {args, flags} = this.parse(WorkspacesGet)
    let data: any[] = []
    let columns = {}

    switch (args.resource) {
    case 'workspaces':
      data = await ws.get()
      columns = {
        workspace_id: {
          header: 'ID',
          minWidth: 30,
        },
        workspace_name: {
          header: 'NAME',
        },
      }
    }

    cli.table(data, columns, {
      printLine: this.log,
      ...flags,
    })
  }
}
