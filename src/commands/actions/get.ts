import {flags} from '@oclif/command'
import {cli} from 'cli-ux'
import BaseWithContext from '../../base-with-context'
import {GetActionsElemResponse} from '../../api/models/actions'

export default class ActionsGet extends BaseWithContext {
  static description = 'get actions of a datastore'

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
    {
      name: 'status_id',
      description: 'status_id of the status action',
    },
  ]

  async run() {
    const {args, flags} = this.parse(ActionsGet)

    let url = `/api/v0/datastores/${args.datastore_id}/actions`
    if (args.status_id) {
      url = `${url}?status_id=${args.status_id}`
    }
    const {data: actions} = await this.hexaapi.get<GetActionsElemResponse[]>(url)

    const columns = {
      action_id: {
        header: 'ID',
      },
      display_id: {
        header: 'DISPLAY_ID',
      },
      name: {
        header: 'NAME',
      },
      operation: {
        header: 'OPERATION',
      },
      is_status_action: {
        header: 'IS_STATUS',
        extended: !args.status_id,
      },
      set_status: {
        header: 'SET_STATUS_ID',
        extended: true,
        get: (row: GetActionsElemResponse) => {
          return row.set_status ? row.set_status : ''
        },
      },
      status_id: {
        header: 'STATUS_ID',
        extended: true,
        get: (row: GetActionsElemResponse) => {
          return row.status_id ? row.status_id : ''
        },
      },
    }

    cli.table(actions, columns, {
      printLine: this.log,
      ...flags,
    })
  }
}
