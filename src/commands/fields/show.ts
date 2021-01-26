import {flags} from '@oclif/command'
import BaseWithContext from '../../base-with-context'
import {GetFieldSettingsResponse} from '../../api/fields/fields'

export default class FieldsShow extends BaseWithContext {
  static description = 'show details of a field'

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
      name: 'field_id',
      description: 'field_id from hexabase',
      required: true,
    },
  ]

  async run() {
    const {args} = this.parse(FieldsShow)

    const url = `/api/v0/datastores/${args.datastore_id}/fields/${args.field_id}`
    const {data: fieldSettings} = await this.hexaapi.get<GetFieldSettingsResponse>(url)

    this.log(JSON.stringify(fieldSettings, undefined, 2))
  }
}
