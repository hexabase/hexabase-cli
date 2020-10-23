import {Command, flags} from '@oclif/command'
import {prompt}  from 'enquirer'
import Conf from 'conf'
import chalk from 'chalk'
import * as auth from '../../api/auth/auth'

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

export default class ContextsLogin extends Command {
  static description = 'log in to hexabase within current context'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    this.parse(ContextsLogin)

    const currentContext = config.get('current-context')
    const apiServer = config.get(`contexts.${currentContext}.server`)

    if (!currentContext || !apiServer) {
      const output = []
      if (!currentContext) output.push(chalk.red('current-context'))
      if (!apiServer) output.push(chalk.red('server'))
      throw new Error(`Missing context settings: ${output.join(', ')}`)
    }

    const {email}: {email: string} = await prompt(questions[0])
    const {password}: {password: string} = await prompt(questions[1])
    const token = await auth.login(apiServer as string, email, password)
    config.set(`hexabase.${currentContext}.email`, email)
    config.set(`hexabase.${currentContext}.token`, token)
    this.log(`Successfully logged in as: ${chalk.cyan(email)}`)
  }
}
