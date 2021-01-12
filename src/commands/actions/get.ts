import {flags} from '@oclif/command'
import {cli} from 'cli-ux'
import * as actn from '../../api/actions/actions'
import BaseWithContext from '../../base-with-context'

export default class ActionsGet extends BaseWithContext {
  static description = 'get actions of a datastore'

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
    ...cli.table.flags(),
  }

  static args = [
    {
      name: 'datastoreId',
      description: 'datastore_id from hexabase',
      required: true,
    },
    {
      name: 'statusId',
      description: 'status_id of the status action',
    },
  ]

  async run() {
    const {args, flags} = this.parse(ActionsGet)

    const actions = await actn.get(this.currentContext, args.datastoreId, args.statusId)
    actions.forEach(action => {
      action.operation = actn.ActionOperation[action.operation as number]
    })

    const columns = {
      a_id: {
        header: 'ID',
        minWidth: 25,
      },
      display_id: {
        header: 'DISPLAY_ID',
        minWidth: 30,
      },
      name: {
        header: 'NAME',
        minWidth: 10,
      },
      operation: {
        header: 'OPERATION',
        minWidth: 10,
      },
      is_status_action: {
        header: 'IS_STATUS',
        minWidth: 10,
        extended: !args.statusId,
      },
      set_status: {
        header: 'SET_STATUS_ID',
        minWidth: 10,
        extended: true,
        get: (row: actn.GetActionsElemResponse) => {
          return row.set_status ? row.set_status : ''
        },
      },
      status_id: {
        header: 'STATUS_ID',
        minWidth: 10,
        extended: true,
        get: (row: actn.GetActionsElemResponse) => {
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
