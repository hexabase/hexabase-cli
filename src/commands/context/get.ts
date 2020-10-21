import {Command, flags} from '@oclif/command'
import chalk from 'chalk'
import Conf from 'conf'
import ux from 'cli-ux'

const config = new Conf()

export default class ContextGet extends Command {
  static description = 'get contexts'

  static flags = {
    help: flags.help({char: 'h'}),
    current: flags.boolean({char: 'c', description: 'get current context'}),
    json: flags.boolean({char: 'j', description: 'output in json format'}),
  }

  async run() {
    const {flags} = this.parse(ContextGet)

    if (flags.current) {
      const currentContext = config.get('current-context')
      return this.log(`Current-context successfully set to: ${chalk.cyan(currentContext)}`)
    }

    const contexts = config.get('contexts')
    if (!contexts) {
      return this.log('No context found')
    }
    if (flags.json) {
      ux.styledJSON(contexts)
    } else {
      this.log(contexts as string)
    }
  }
}
