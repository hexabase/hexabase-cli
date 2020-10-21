import {Command, flags} from '@oclif/command'
import Conf from 'conf'

const config = new Conf()

export default class ContextSet extends Command {
  static description = 'set context'

  static flags = {
    help: flags.help({char: 'h'}),
    server: flags.string({description: 'API server address, e.g. http://localhost'}),
    sse: flags.string({description: 'SSE server address, e.g. http://localhost'}),
  }

  static args = [
    {
      name: 'name',
      required: true,
    },
  ]

  async run() {
    const {args, flags} = this.parse(ContextSet)
    try {
      if (Object.keys(flags).length === 0 && typeof flags === 'object') {
        throw new Error('at least one flag needed')
      }
      Object.entries(flags).forEach(entry => {
        config.set(`contexts.${args.name}.${entry[0]}`, entry[1])
      })
    } catch (error) {
      this.error(error)
    }
  }
}
