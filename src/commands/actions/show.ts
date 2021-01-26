import {flags} from '@oclif/command'
import BaseWithContext from '../../base-with-context'
import {GetActionSettingsResponse} from '../../api/models/actions'

export default class ActionsShow extends BaseWithContext {
  static description = 'show details of an action'

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
  }

  static args = [
    {
      name: 'datastore_id',
      description: 'datastore_id from hexabase',
      required: true,
    },
    {
      name: 'action_id',
      description: 'action_id from hexabase',
      required: true,
    },
  ]

  async run() {
    const {args} = this.parse(ActionsShow)

    const url = `/api/v0/datastores/${args.datastore_id}/actions/${args.action_id}`
    const {data: actionSettings} = await this.hexaapi.get<GetActionSettingsResponse>(url)

    this.log(JSON.stringify(actionSettings, undefined, 2))
  }
}
