import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import chalk from 'chalk'
import BaseWithContext from '../../base-with-context'

export default class FieldsDelete extends BaseWithContext {
  private questions = [
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Do you want to proceed?',
    },
  ]

  static description = 'delete a field in a datastore'

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
    yes: flags.boolean({char: 'y', description: 'skip confirmation'}),
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
    const {args, flags} = this.parse(FieldsDelete)

    let shouldProceed = false
    if (flags.yes) {
      shouldProceed = true
    } else {
      this.log(`You are about to delete the field with id: ${chalk.cyan(args.field_id)}`)
      shouldProceed = await prompt(this.questions[0]).then(({confirm}: any) => confirm as boolean)
    }

    if (shouldProceed) {
      const url = `/api/v0/datastores/${args.datastore_id}/fields/${args.field_id}`
      await this.hexaAPI.delete<void>(url)
      this.log('Field successfully deleted')
    } else {
      this.log(chalk.red('Deletion  aborted'))
    }
  }
}
