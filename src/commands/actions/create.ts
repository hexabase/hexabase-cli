import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import chalk from 'chalk'
import BaseWithContext from '../../base-with-context'
import {ActionData, ActionName, CreateActionResponse} from '../../api/actions/actions'

export default class ActionsCreate extends BaseWithContext {
  private questions = [
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
      message: 'Please provide the name for your action',
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

  static description = 'create action in a database'

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
    const {args} = this.parse(ActionsCreate)

    const {operationType}: {operationType: string} = await prompt(this.questions[0])
    const {roles}: {roles: string[]} = await prompt(this.questions[1])
    const {actionName}: {actionName: ActionName} = await prompt(this.questions[2])
    this.log(`Project Name (en): ${chalk.cyan(actionName.en)}`)
    this.log(`Project Name (ja): ${chalk.cyan(actionName.ja)}`)

    const data: ActionData = {
      operation: operationType,
      name: actionName,
      roles: roles,
    }

    const url = `/api/v0/datastores/${args.datastore_id}/actions`
    const {data: action} = await this.hexaapi.post<CreateActionResponse>(url, data)
    this.log(`Action successfully created:
action_id: ${chalk.cyan(action.action_id)}
display_id: ${chalk.cyan(action.display_id)}`
    )
  }
}
