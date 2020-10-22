import {Command, flags} from '@oclif/command'
import chalk from 'chalk'

export default class ContextIndex extends Command {
  static description = `display help for ${chalk.cyan('context')} topic`

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    this._help()
  }
}
