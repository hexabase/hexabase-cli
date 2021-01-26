import {Command, flags} from '@oclif/command'
import {Input} from '@oclif/parser'
import Conf from 'conf'
import chalk from 'chalk'
import {APIClient} from './api/api-client'
import {SSEClient} from './api/sse-client'

type Context = {
  server: string;
  sse: string;
}

export default abstract class BaseWithContext extends Command {
  static flags = {
    context: flags.string({char: 'c', description: 'use provided context instead of currently set context'}),
  };

  private _hexaapi!: APIClient

  private _hexasse!: SSEClient

  hexaconfig = new Conf()

  context!: Context

  currentContext!: string | flags.IOptionFlag<string|undefined>

  get hexaapi(): APIClient {
    return this._hexaapi
  }

  get hexasse(): SSEClient {
    return this._hexasse
  }

  async init() {
    const {flags} = this.parse(this.constructor as Input<typeof BaseWithContext.flags>)

    if (flags.context) {
      this.currentContext = flags.context
    } else {
      this.currentContext = this.hexaconfig.get('current-context') as string
      if (!this.currentContext) {
        throw new Error(`Missing context setting: ${chalk.red('current-context')}`)
      }
    }

    const context = this.hexaconfig.get(`contexts.${this.currentContext}`)
    if (!context) {
      throw new Error(`No such context: ${chalk.red(flags.context)}`)
    }
    this.context = context as Context

    const token = this.hexaconfig.get(`hexabase.${this.currentContext}.token`)
    if (!token) {
      throw new Error('Could not get login info')
    }
    const authConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    this._hexaapi = new APIClient(this.context.server, authConfig)
    this._hexasse = new SSEClient(this.context.sse)
  }
}
