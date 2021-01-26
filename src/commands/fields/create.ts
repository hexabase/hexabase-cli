import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import chalk from 'chalk'
import BaseWithContext from '../../base-with-context'
import {defaults} from '../../api/fields/data-types'
import {CreateFieldResponse, FieldData, FieldName} from '../../api/fields/fields'

export default class FieldsCreate extends BaseWithContext {
  private questions = [
    {
      type: 'select',
      name: 'dataType',
      message: 'Select a data type',
      choices: Object.keys(defaults).map(key => {
        return {
          message: defaults[key].name,
          value: defaults[key].dataType,
        }
      }),
    },
    {
      type: 'list',
      name: 'roles',
      message: 'Add comma-separated role_ids (must include admin role)',
      validate: function (roles: string | string[]) {
        if (roles.length === 0) {
          return 'At least one item needed'
        }
        if (Array.isArray(roles) && roles.some(role => role.trim() === '')) {
          return 'Empty role_id'
        }
        return roles.length > 0
      },
    },
    {
      type: 'form',
      name: 'fieldName',
      message: 'Please provide the name for your field',
      choices: [
        {name: 'en', message: 'Field Name (en)', validate(value: string) {
          return value.length > 0
        }},
        {name: 'ja', message: 'Field Name (ja)', validate(value: string) {
          return value.length > 0
        }},
      ],
      validate(value: any) {
        return (value.en.length > 0 && value.ja.length > 0) ? true : 'Cannot be empty'
      },
    },
  ]

  static description = 'create field of a database'

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
  ]

  async run() {
    const {args} = this.parse(FieldsCreate)

    const {dataType}: {dataType: string} = await prompt(this.questions[0])
    const {roles}: {roles: string[]} = await prompt(this.questions[1])
    const {fieldName}: {fieldName: FieldName} = await prompt(this.questions[2])
    this.log(`Field Name (en): ${chalk.cyan(fieldName.en)}`)
    this.log(`Field Name (ja): ${chalk.cyan(fieldName.ja)}`)

    const data: FieldData = {
      name: fieldName,
      dataType: defaults[dataType].dataType,
      as_title: defaults[dataType].asTitle,
      search: defaults[dataType].search,
      show_list: defaults[dataType].showList,
      full_text: defaults[dataType].fullText,
      unique: defaults[dataType].unique,
      roles: roles,
    }

    const url = `/api/v0/datastores/${args.datastore_id}/fields`
    const {data: field} = await this.hexaapi.post<CreateFieldResponse>(url, data)
    this.log(`Field successfully created:
field_id: ${chalk.cyan(field.field_id)}
display_id: ${chalk.cyan(field.display_id)}`
    )
  }
}
