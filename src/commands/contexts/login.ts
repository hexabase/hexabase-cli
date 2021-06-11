import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import chalk from 'chalk'
import BaseWithContext from '../../base-with-context'
import {PostLoginResponse} from '../../api/models/auth'

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
    const {args, flags} = this.parse(ContextsLogin)
    let {email, password} = flags

    if (!flags.email) {
      email = await prompt(this.questions[0])
    }
    if (!flags.password) {
      const p:{password: string} = await prompt(this.questions[1])
      password = p.password
    }

    const data = {email, password}
    const url = '/api/v0/login'
    try{
      const {data: {token}} = await this.hexaapi.post<PostLoginResponse>(url, data)
      this.hexaconfig.set(`hexabase.${this.currentContext}.email`, email)
      this.hexaconfig.set(`hexabase.${this.currentContext}.token`, token)
      this.log(`Successfully logged in as: ${chalk.cyan(email)}`)
    }catch{
      this.log(`login ${chalk.red('failed')} for ${chalk.cyan(email)}`)
    }

  }
}
