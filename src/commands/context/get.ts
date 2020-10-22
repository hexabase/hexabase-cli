import {Command, flags} from '@oclif/command'
import chalk from 'chalk'
import Conf from 'conf'
import ux from 'cli-ux'

const config = new Conf()

export default class ContextGet extends Command {
  static description = 'get contexts'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    this.parse(ContextGet)

    const currentContext = config.get('current-context')
    const contexts = config.get('contexts')

    if (!contexts) {
      return this.log('No context found')
    }

    ux.styledJSON(contexts)
    this.log(`Current-context set to: ${currentContext ?
      chalk.cyan(currentContext) :
      chalk.red(currentContext)}`)
  }
}
