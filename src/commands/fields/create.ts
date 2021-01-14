import {flags} from '@oclif/command'
import {prompt}  from 'enquirer'
import chalk from 'chalk'
import BaseWithContext from '../../base-with-context'
import * as fld from '../../api/fields/fields'
import {defaults} from '../../api/fields/data-types'

const questions = [
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
    type: 'form',
    name: 'fieldName',
    message: 'Please provide a name for your field',
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

export default class FieldsCreate extends BaseWithContext {
  static description = 'create field of a database'

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
  }

  async run() {
    this.parse(FieldsCreate)

    const {dataType}: {dataType: string} = await prompt(questions[0])

    const {fieldName}: {fieldName: fld.FieldName} = await prompt(questions[1])
    this.log(`Project Name (en): ${chalk.cyan(fieldName.en)}`)
    this.log(`Project Name (ja): ${chalk.cyan(fieldName.ja)}`)

    const data: fld.CreateFieldData = {
      name: fieldName,
      dataType: defaults[dataType].dataType,
      as_title: defaults[dataType].asTitle,
      search: defaults[dataType].search,
      show_list: defaults[dataType].showList,
      full_text: defaults[dataType].fullText,
      unique: defaults[dataType].unique,
      roles: ['5ff6c5d5d87ffd3d7ec98b54'],
    }

    const {field_id} = await fld.create(this.currentContext, '5ff6c5ffd87ffd41074a5e08', data)
    this.log(`Field successfully created. field_id set to: ${chalk.cyan(field_id)}`)
  }
}
