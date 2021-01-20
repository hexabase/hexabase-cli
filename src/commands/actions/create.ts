import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import chalk from 'chalk'
import BaseWithContext from '../../base-with-context'
import * as actn from '../../api/actions/actions'

const questions = [
  {
    type: 'select',
    name: 'operationType',
    message: 'Select operation type',
    choices: ['new', 'update', 'delete', 'copy'],
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
    name: 'actionName',
    message: 'Please provide name & display id for your action',
    choices: [
      {name: 'en', message: 'Action Name (en)', validate(value: string) {
        return value.length > 0
      }},
      {name: 'ja', message: 'Action Name (ja)', validate(value: string) {
        return value.length > 0
      }},
    ],
    validate(value: any) {
      return (value.en.length > 0 && value.ja.length > 0) ? true : 'Cannot be empty'
    },
  },
]

export default class ActionsCreate extends BaseWithContext {
  static description = 'create action in a database'

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
  ]

  async run() {
    const {args} = this.parse(ActionsCreate)

    const {operationType}: {operationType: string} = await prompt(questions[0])
    const {roles}: {roles: string[]} = await prompt(questions[1])
    const {actionName}: {actionName: actn.ActionName} = await prompt(questions[2])
    this.log(`Project Name (en): ${chalk.cyan(actionName.en)}`)
    this.log(`Project Name (ja): ${chalk.cyan(actionName.ja)}`)

    const data: actn.ActionData = {
      operation: operationType,
      name: actionName,
      roles: roles,
    }

    const {action_id} = await actn.create(this.currentContext, args.datastoreId, data)
    this.log(`Action successfully created. action_id set to: ${chalk.cyan(action_id)}`)
  }
}
