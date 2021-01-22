import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import chalk from 'chalk'
import BaseWithContext from '../../base-with-context'
import * as actn from '../../api/actions/actions'

export default class ActionsUpdate extends BaseWithContext {
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
      name: 'actionForm',
      message: 'Please provide the display_id and name for your action',
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
          message: 'Action Name (en)',
          initial: '',
          validate(value: string) {
            return value.length > 0
          },
        },
        {
          name: 'ja',
          message: 'Action Name (ja)',
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

  static description = 'update action of a database'

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
      name: 'action_id',
      description: 'action_id from hexabase',
      required: true,
    },
  ]

  async run() {
    const {args} = this.parse(ActionsUpdate)

    const actionSettings = await actn.getOne(this.currentContext, args.datastore_id, args.action_id)
    this.questions[0].initial = actionSettings.roles.filter(role => role.can_execute).map(role => role.role_id).join(', ')
    const {roles}: {roles: string[]} = await prompt(this.questions[0])
    this.questions[1].choices![0].initial = actionSettings.display_id
    this.questions[1].choices![1].initial = actionSettings.name.en
    this.questions[1].choices![2].initial = actionSettings.name.ja
    const {actionForm}: {actionForm: {[key: string]: string}} = await prompt(this.questions[1])
    this.log(`Display_ID: ${chalk.cyan(actionForm.display_id)}`)
    this.log(`Action Name (en): ${chalk.cyan(actionForm.en)}`)
    this.log(`Action Name (ja): ${chalk.cyan(actionForm.ja)}`)

    const data: actn.ActionData = {
      display_id: actionForm.display_id,
      name: {en: actionForm.en, ja: actionForm.ja},
      roles: roles,
    }

    await actn.update(this.currentContext, args.datastore_id, args.action_id, data)
    this.log('Action successfully updated')
  }
}
