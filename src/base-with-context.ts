import {Command, flags} from '@oclif/command'
import {Input} from '@oclif/parser'
import Conf from 'conf'
import chalk from 'chalk'

const config = new Conf()

export default abstract class BaseWithContext extends Command {
  static flags = {
    context: flags.string({char: 'c', description: 'use provided context instead of currently set context'}),
  };

  currentContext: unknown | string

  async init() {
    const {flags} = this.parse(this.constructor as Input<typeof BaseWithContext.flags>)

    const currentContext = config.get('current-context')
    if (!currentContext) {
      throw new Error(`Missing context setting: ${chalk.red('current-context')}`)
    }

    this.currentContext = currentContext
  }

  getApiServer() {
    const apiServer = config.get(`contexts.${this.currentContext}.server`)
    if (!apiServer) {
      throw new Error(`Missing context setting: ${chalk.red('server')}`)
    }
    return apiServer as string
  }

  getSSE() {
    const sse = config.get(`contexts.${this.currentContext}.sse`)
    if (!sse) {
      throw new Error(`Missing context setting: ${chalk.red('sse')}`)
    }
    return sse as string
  }
}
