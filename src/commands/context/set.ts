import {Command, flags} from '@oclif/command'
import chalk from 'chalk'
import Conf from 'conf'

const config = new Conf()

export default class ContextSet extends Command {
  static description = 'set context entries (server, sse, etc)'

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
    if (Object.keys(flags).length === 0 && typeof flags === 'object') {
      throw new Error('at least one flag needed')
    }
    Object.entries(flags).forEach(entry => {
      config.set(`contexts.${args.name}.${entry[0]}`, entry[1])
    })
    if (!config.get('current-context')) {
      config.set('current-context', args.name)
      this.log(`Current-context set to: ${chalk.cyan(args.name)}`)
    }
  }
}
