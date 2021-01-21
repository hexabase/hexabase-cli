import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import chalk from 'chalk'
import BaseWithContext from '../../base-with-context'
import * as fld from '../../api/fields/fields'

export default class FieldsUpdate extends BaseWithContext {
  private questions = [
    {
      type: 'list',
      name: 'roles',
      message: 'Add comma-separated role_ids (must include admin role)',
      initial: '',
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
        {
          name: 'en',
          message: 'Field Name (en)',
          initial: '',
          validate(value: string) {
            return value.length > 0
          },
        },
        {
          name: 'ja',
          message: 'Field Name (ja)',
          initial: '',
          validate(value: string) {
            return value.length > 0
          },
        },
      ],
      validate(value: any) {
        return (value.en.length > 0 && value.ja.length > 0) ? true : 'Cannot be empty'
      },
    },
  ]

  static description = 'update field of a database'

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
  }

  static args = [
    {
      name: 'datastoreId',
      description: 'datastore_id from hexabase',
      required: true,
    },
    {
      name: 'fieldId',
      description: 'field_id from hexabase',
      required: true,
    },
  ]

  async run() {
    const {args} = this.parse(FieldsUpdate)

    const fieldSettings = await fld.getOne(this.currentContext, args.datastoreId, args.fieldId)
    this.questions[0].initial = fieldSettings.roles.filter(role => role.can_use).map(role => role.role_id).join(', ')
    const {roles}: {roles: string[]} = await prompt(this.questions[0])
    this.questions[1].choices![0].initial = fieldSettings.name.en
    this.questions[1].choices![1].initial = fieldSettings.name.ja
    const {fieldName}: {fieldName: fld.FieldName} = await prompt(this.questions[1])
    this.log(`Field Name (en): ${chalk.cyan(fieldName.en)}`)
    this.log(`Field Name (ja): ${chalk.cyan(fieldName.ja)}`)

    const data: fld.FieldData = {
      name: fieldName,
      roles: roles,
    }

    await fld.update(this.currentContext, args.datastoreId, args.fieldId, data)
    this.log('Field successfully updated')
  }
}
