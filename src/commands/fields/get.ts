import {flags} from '@oclif/command'
import {cli} from 'cli-ux'
import * as fld from '../../api/fields/fields'
import BaseWithContext from '../../base-with-context'

export default class FieldsGet extends BaseWithContext {
  static description = 'get fields of a datastore'

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
  ]

  async run() {
    const {args, flags} = this.parse(FieldsGet)

    const fieldsResponse = await fld.get(this.currentContext, args.datastoreId)
    let fields: fld.GetFieldsElemResponse[] = []
    if (fieldsResponse?.fields) {
      // fieldsResponse is returned as an object -> convert to sorted array
      fields = Object.keys(fieldsResponse.fields)
      .map(key => fieldsResponse.fields[key])
      .sort((x, y) => x.fieldIndex - y.fieldIndex)
    }

    const columns = {
      field_id: {
        header: 'ID',
        minWidth: 25,
      },
      display_id: {
        header: 'DISPLAY_ID',
        minWidth: 20,
      },
      name: {
        header: 'NAME',
        minWidth: 20,
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
