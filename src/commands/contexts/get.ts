import {Command, flags} from '@oclif/command'
import {cli} from 'cli-ux'
import chalk from 'chalk'
import Conf from 'conf'

const config = new Conf()

export default class ContextsGet extends Command {
  static description = 'get contexts'

  static flags = {
    help: flags.help({char: 'h'}),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(ContextsGet)

    const currentContext = config.get('current-context')
    const contexts = config.get('contexts') as {[key: string]: any}

    if (!contexts) {
      return this.log('No context found')
    }

    const contextsArray = Object.entries(contexts).map(item => {
      return {
        name: item[0],
        server: item[1].server,
        sse: item[1].sse,
      }
    })
    const columns = {
      name: {
        header: 'NAME',
      },
      server: {
        header: 'SERVER',
      },
      sse: {
        header: 'SSE',
      },
    }

    cli.table(contextsArray, columns, {
      printLine: this.log,
      ...flags,
    })
    if (!flags.output) {
      this.log(`Current-context set to: ${currentContext ?
        chalk.cyan(currentContext) :
        chalk.red(currentContext)}`)
    }
  }
}
