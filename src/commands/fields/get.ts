import {flags} from '@oclif/command'
import {cli} from 'cli-ux'
import {GetFieldsElemResponse, GetFieldsResponse} from '../../api/models/fields'
import BaseWithContext from '../../base-with-context'

export default class FieldsGet extends BaseWithContext {
  static description = 'get fields in a datastore'

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
    const {args, flags} = this.parse(FieldsGet)

    const url = `/api/v0/datastores/${args.datastore_id}/fields`
    const {data: fieldsResponse} = await this.hexaapi.get<GetFieldsResponse>(url)
    let fields: GetFieldsElemResponse[] = []
    if (fieldsResponse.fields) {
      // fieldsResponse is returned as an object -> convert to sorted array
      fields = Object.keys(fieldsResponse.fields)
      .map(key => fieldsResponse.fields[key])
      .sort((x, y) => x.fieldIndex - y.fieldIndex)
    }

    const columns = {
      field_id: {
        header: 'ID',
      },
      display_id: {
        header: 'DISPLAY_ID',
      },
      name: {
        header: 'NAME',
      },
      dataType: {
        header: 'DATA_TYPE',
      },
    }

    cli.table(fields, columns, {
      printLine: this.log,
      ...flags,
    })
  }
}
