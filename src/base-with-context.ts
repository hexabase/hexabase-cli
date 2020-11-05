import Command from '@oclif/command'
import Conf from 'conf'
import chalk from 'chalk'

const config = new Conf()

export default abstract class extends Command {
  currentContext: unknown | string

  async init() {
    // const {flags} = this.parse(this.constructor)
    // this.flags = flags

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
