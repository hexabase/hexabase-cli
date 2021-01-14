import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import Conf from 'conf'
import chalk from 'chalk'
import * as auth from '../../api/auth/auth'
import BaseWithContext from '../../base-with-context'

const config = new Conf()

const questions = [
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

export default class ContextsLogin extends BaseWithContext {
  static description = 'log in to hexabase within current context'

  static aliases = ['login']

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
  }

  async run() {
    this.parse(ContextsLogin)

    const {email}: {email: string} = await prompt(questions[0])
    const {password}: {password: string} = await prompt(questions[1])
    const token = await auth.login(this.currentContext, email, password)
    config.set(`hexabase.${this.currentContext}.email`, email)
    config.set(`hexabase.${this.currentContext}.token`, token)
    this.log(`Successfully logged in as: ${chalk.cyan(email)}`)
  }
}
