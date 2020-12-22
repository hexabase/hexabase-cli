import {Command, flags} from '@oclif/command'
import {Input} from '@oclif/parser'
import Conf from 'conf'
import chalk from 'chalk'

export interface Context{
  server: string;
  sse: string;
}

const config = new Conf()

export default abstract class BaseWithContext extends Command {
  static flags = {
    context: flags.string({char: 'c', description: 'use provided context instead of currently set context'}),
  };

  currentContext = ''

  async init() {
    const {flags} = this.parse(this.constructor as Input<typeof BaseWithContext.flags>)

    let context: unknown | string
    if (flags.context) {
      if (!config.get(`contexts.${flags.context}`)) {
        throw new Error(`No such context: ${chalk.red(flags.context)}`)
      }
      context = flags.context
    } else {
      context = config.get('current-context')
      if (!context) {
        throw new Error(`Missing context setting: ${chalk.red('current-context')}`)
      }
    }

    this.currentContext = context as string
  }
}
