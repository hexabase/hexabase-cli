import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import chalk from 'chalk'
import BaseWithContext from '../../base-with-context'
import * as actn from '../../api/actions/actions'

const questions = [
  {
    type: 'confirm',
    name: 'confirm',
    message: 'Do you want to proceed?',
  },
]

export default class ActionsDelete extends BaseWithContext {
  static description = 'delete action of a database'

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
      name: 'actionId',
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
      this.log(`You are about to delete the action with id: ${chalk.cyan(args.actionId)}`)
      shouldProceed = await prompt(questions[0]).then(({confirm}: any) => confirm as boolean)
    }

    if (shouldProceed) {
      await actn.del(this.currentContext, args.datastoreId, args.actionId)
      this.log('action successfully deleted')
    } else {
      this.log(chalk.red('deletion  aborted'))
    }
  }
}
