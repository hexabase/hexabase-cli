import Command from '@oclif/command'
import Conf from 'conf'
import chalk from 'chalk'

const config = new Conf()

export default abstract class extends Command {
  currentContext: unknown | string

  apiServer: unknown | string

  async init() {
    // const {flags} = this.parse(this.constructor)
    // this.flags = flags

    const currentContext = config.get('current-context')
    if (!currentContext) {
      throw new Error(`Missing context settings: ${chalk.red('current-context')}`)
    }

    const apiServer = config.get(`contexts.${currentContext}.server`)
    if (!apiServer) {
      throw new Error(`Missing context settings: ${chalk.red('server')}`)
    }

    this.currentContext = currentContext
    this.apiServer = apiServer
  }
}
