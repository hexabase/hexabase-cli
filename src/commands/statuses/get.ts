import {flags} from '@oclif/command'
import {cli} from 'cli-ux'
import {GetStatusesElemResponse} from '../../api/models/statuses'
import BaseWithContext from '../../base-with-context'

export default class StatusesGet extends BaseWithContext {
  static description = 'get statuses in a datastore'

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
    ...cli.table.flags(),
  }

  static args = [
    {
      name: 'datastore_id',
      description: 'datastore_id from hexabase',
      required: true,
    },
  ]

  async run() {
    const {args, flags} = this.parse(StatusesGet)

    const url = `/api/v0/datastores/${args.datastore_id}/statuses`
    const {data: statuses} = await this.hexaapi.get<GetStatusesElemResponse[]>(url)

    const columns = {
      status_id: {
        header: 'ID',
      },
      display_id: {
        header: 'DISPLAY_ID',
      },
      name: {
        header: 'NAME',
        get: (row: GetStatusesElemResponse) => row.displayed_name,
      },
      sort_id: {
        header: 'SORT_ID',
        extended: true,
      },
      x: {
        header: 'X',
        extended: true,
      },
      y: {
        header: 'Y',
        extended: true,
      },
    }

    cli.table(statuses, columns, {
      printLine: this.log,
      ...flags,
    })
  }
}
