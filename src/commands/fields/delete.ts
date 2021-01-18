import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import chalk from 'chalk'
import BaseWithContext from '../../base-with-context'
import * as fld from '../../api/fields/fields'

const questions = [
  {
    type: 'confirm',
    name: 'confirm',
    message: 'Do you want to proceed?',
  },
]

export default class FieldsDelete extends BaseWithContext {
  static description = 'delete field of a database'

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
    yes: flags.boolean({char: 'y', description: 'skip confirmation'}),
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
    const {args, flags} = this.parse(FieldsDelete)

    let shouldProceed = false
    if (flags.yes) {
      shouldProceed = true
    } else {
      this.log(`You are about to delete the field with id: ${chalk.cyan(args.fieldId)}`)
      shouldProceed = await prompt(questions[0]).then(({confirm}: any) => confirm as boolean)
    }

    if (shouldProceed) {
      await fld.del(this.currentContext, args.datastoreId, args.fieldId)
      this.log('Field successfully deleted')
    } else {
      this.log(chalk.red('deletion  aborted'))
    }
  }
}
