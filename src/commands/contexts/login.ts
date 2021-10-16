import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import chalk from 'chalk'
import BaseWithContext from '../../base-with-context'
import {GetUserInfoResponse, PostLoginResponse} from '../../api/models/auth'

export default class ContextsLogin extends BaseWithContext {
  private questions = [
    {
      type: 'input',
      name: 'email',
      message: `Enter your ${chalk.cyan('email')}`,
    },
    {
      type: 'password',
      name: 'password',
      message: `Enter your ${chalk.cyan('password')}`,
    },
  ]

  static description = 'login to hexabase within current context'

  static aliases = ['login']

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
  }

  async run() {
    this.parse(ContextsLogin)

    const {email}: {email: string} = await prompt(this.questions[0])
    const {password}: {password: string} = await prompt(this.questions[1])

    const data = {email, password}
    let url = '/api/v0/login'
    const {data: {token}} = await this.hexaapi.post<PostLoginResponse>(url, data)

    url = '/api/v0/userinfo'
    const {data: {u_id}} = await this.hexaapi.get<GetUserInfoResponse>(url)

    this.hexaconfig.set(`hexabase.${this.currentContext}.email`, email)
    this.hexaconfig.set(`hexabase.${this.currentContext}.token`, token)
    this.hexaconfig.set(`hexabase.${this.currentContext}.user_id`, u_id)
    this.log(`Successfully logged in as: ${chalk.cyan(email)}`)
  }
}
