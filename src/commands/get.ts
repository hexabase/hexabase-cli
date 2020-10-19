import {Command, flags} from '@oclif/command'
import {cli} from 'cli-ux'
import * as ws from '../api/workspaces/workspaces'

export default class Get extends Command {
  static description = 'get resources from hexabase'

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
    const {args, flags} = this.parse(Get)
    let data: any[] = []
    let columns = {}
    try {
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
    } catch (error) {
      this.error(error)
    }
    cli.table(data, columns, {
      printLine: this.log,
      ...flags,
    })
  }
}
