import {Command, flags} from '@oclif/command'
import chalk from 'chalk'
import Conf from 'conf'

const config = new Conf()

export default class ContextsSet extends Command {
  static description = 'set context entries (server, sse, etc)'

  static flags = {
    help: flags.help({char: 'h'}),
    server: flags.string({description: 'API server, e.g. https://api.hexabase.com'}),
    sse: flags.string({description: 'SSE server, e.g. https://sse.hexabase.com'}),
  }

  static args = [
    {
      name: 'name',
      required: true,
    },
  ]

  async run() {
    const {args, flags} = this.parse(ContextsSet)
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
