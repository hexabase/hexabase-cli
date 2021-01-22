import {flags} from '@oclif/command'
import BaseWithContext from '../../base-with-context'
import * as actn from '../../api/actions/actions'

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

    const actionSettings = await actn.getOne(this.currentContext, args.datastore_id, args.action_id)

    this.log(JSON.stringify(actionSettings, undefined, 2))
  }
}
