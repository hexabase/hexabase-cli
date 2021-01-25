import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import chalk from 'chalk'
import BaseWithContext from '../../base-with-context'

export default class ActionsDelete extends BaseWithContext {
  private questions = [
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Do you want to proceed?',
    },
  ]

  static description = 'delete action of a database'

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
      name: 'action_id',
      description: 'action_id from hexabase',
      required: true,
    },
  ]

  async run() {
    const {args, flags} = this.parse(ActionsDelete)

    let shouldProceed = false
    if (flags.yes) {
      shouldProceed = true
    } else {
      this.log(`You are about to delete the action with id: ${chalk.cyan(args.action_id)}`)
      shouldProceed = await prompt(this.questions[0]).then(({confirm}: any) => confirm as boolean)
    }

    if (shouldProceed) {
      const url = `/api/v0/datastores/${args.datastore_id}/actions/${args.action_id}`
      await this.hexaapi.delete<void>(url)
      this.log('action successfully deleted')
    } else {
      this.log(chalk.red('deletion  aborted'))
    }
  }
}
