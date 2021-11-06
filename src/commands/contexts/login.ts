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
    email: flags.string({char: 'u', description: 'user email address to login'}),
    password: flags.string({char: 'p', description: 'login password'}),
  }

  async run() {
    const {flags} = this.parse(ContextsLogin)
    let {email, password} = flags

    if (!flags.email) {
      ({email} = await prompt(this.questions[0]))
    }
    if (!flags.password) {
      ({password} = await prompt(this.questions[1]))
    }

    const data = {email, password}

    try {
      let url = '/api/v0/login'
      const {data: {token}} = await this.hexaAPI.post<PostLoginResponse>(url, data)
      this.hexaConfig.set(`hexabase.${this.currentContext}.email`, email)
      this.hexaConfig.set(`hexabase.${this.currentContext}.token`, token)
      this.configureHexaAPI()

      url = '/api/v0/userinfo'
      const {data: {u_id}} = await this.hexaAPI.get<GetUserInfoResponse>(url)
      this.hexaConfig.set(`hexabase.${this.currentContext}.user_id`, u_id)

      this.log(`Successfully logged in as: ${chalk.cyan(email)}`)
    } catch (error) {
      this.log(`Login ${chalk.red('failed')} for ${chalk.cyan(email)}`)
      this.debug(error)
      throw error
    }
  }
}
