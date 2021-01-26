import {Command, flags} from '@oclif/command'
import {Input} from '@oclif/parser'
import Conf from 'conf'
import chalk from 'chalk'
import {APIClient} from './api/api-client'

type Context = {
  server: string;
  sse: string;
}

const config = new Conf()

export default abstract class BaseWithContext extends Command {
  static flags = {
    context: flags.string({char: 'c', description: 'use provided context instead of currently set context'}),
  };

  private _hexaapi!: APIClient

  context!: Context

  currentContext!: string | flags.IOptionFlag<string|undefined>

  get hexaapi(): APIClient {
    return this._hexaapi
  }

  async init() {
    const {flags} = this.parse(this.constructor as Input<typeof BaseWithContext.flags>)

    if (flags.context) {
      this.currentContext = flags.context
    } else {
      this.currentContext = config.get('current-context') as string
      if (!this.currentContext) {
        throw new Error(`Missing context setting: ${chalk.red('current-context')}`)
      }
    }

    const context = config.get(`contexts.${this.currentContext}`)
    if (!context) {
      throw new Error(`No such context: ${chalk.red(flags.context)}`)
    }
    this.context = context as Context

    const token = config.get(`hexabase.${this.currentContext}.token`)
    if (!token) {
      throw new Error('Could not get login info')
    }
    const authConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    this._hexaapi = new APIClient(this.context.server, authConfig)
  }
}
