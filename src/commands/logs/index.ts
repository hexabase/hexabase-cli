import {Command, flags} from '@oclif/command'
import chalk from 'chalk'

export default class LogsIndex extends Command {
  static description = `display help for ${chalk.cyan('logs')} topic`

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    this._help()
  }
}
