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
      name: 'fieldForm',
      message: 'Please provide the display_id and name for your field',
      choices: [
        {
          name: 'display_id',
          message: 'Display_ID',
          initial: '',
          validate(value: string) {
            return value.length > 0
          },
        },
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
    const {args} = this.parse(FieldsUpdate)

    const fieldSettings = await fld.getOne(this.currentContext, args.datastore_id, args.field_id)
    this.questions[0].initial = fieldSettings.roles.filter(role => role.can_use).map(role => role.role_id).join(', ')
    const {roles}: {roles: string[]} = await prompt(this.questions[0])
    this.questions[1].choices![0].initial = fieldSettings.display_id
    this.questions[1].choices![1].initial = fieldSettings.name.en
    this.questions[1].choices![2].initial = fieldSettings.name.ja
    const {fieldForm}: {fieldForm: {[key: string]: string}} = await prompt(this.questions[1])
    this.log(`Display_ID: ${chalk.cyan(fieldForm.display_id)}`)
    this.log(`Field Name (en): ${chalk.cyan(fieldForm.en)}`)
    this.log(`Field Name (ja): ${chalk.cyan(fieldForm.ja)}`)

    const data: fld.FieldData = {
      display_id: fieldForm.display_id,
      name: {en: fieldForm.en, ja: fieldForm.ja},
      roles: roles,
    }

    await fld.update(this.currentContext, args.datastore_id, args.field_id, data)
    this.log('Field successfully updated')
  }
}
