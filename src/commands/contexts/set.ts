import {Command, flags} from '@oclif/command'
import chalk from 'chalk'
import Conf from 'conf'

export default class ContextsSet extends Command {
  static description = 'set context entries (server & sse)'

  static flags = {
    help: flags.help({char: 'h'}),
    server: flags.string({description: 'API server, e.g. https://api.hexabase.com'}),
    sse: flags.string({description: 'SSE server, e.g. https://sse.hexabase.com'}),
  }

  static args = [
    {
      name: 'context',
      description: 'context name',
      required: true,
    },
  ]

  hexaConfig = new Conf()

  async run() {
    const {args, flags} = this.parse(ContextsSet)
    if (Object.keys(flags).length === 0 && typeof flags === 'object') {
      throw new Error('At least one flag needed')
    }
    Object.entries(flags).forEach(entry => {
      this.hexaConfig.set(`contexts.${args.context}.${entry[0]}`, entry[1])
    })
    if (!this.hexaConfig.get('current-context')) {
      this.hexaConfig.set('current-context', args.context)
      this.log(`Current-context set to: ${chalk.cyan(args.context)}`)
    }
  }
}
