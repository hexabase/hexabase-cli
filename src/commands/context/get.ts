import {Command, flags} from '@oclif/command'
import Conf from 'conf'
import ux from 'cli-ux'

const config = new Conf()

export default class ContextGet extends Command {
  static description = 'get contexts'

  static flags = {
    help: flags.help({char: 'h'}),
    json: flags.boolean({char: 'j', description: 'output in json format'}),
  }

  async run() {
    const {flags} = this.parse(ContextGet)
    try {
      const contexts = config.get('contexts')
      if (!contexts) {
        return this.log('No context found')
      }
      if (flags.json) {
        ux.styledJSON(contexts)
      } else {
        this.log(contexts as string)
      }
    } catch (error) {
      this.error(error)
    }
  }
}
