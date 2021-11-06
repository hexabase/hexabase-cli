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

  private _hexaAPI!: APIClient

  private _hexaSSE!: SSEClient

  hexaconfig = new Conf()

  context!: Context

  currentContext!: string | flags.IOptionFlag<string|undefined>

  get hexaAPI(): APIClient {
    return this._hexaAPI
  }

  get hexaSSE(): SSEClient {
    return this._hexaSSE
  }

  configureHexaAPI(): void {
    let authConfig = {}
    const token = this.hexaconfig.get(`hexabase.${this.currentContext}.token`)
    if (token) {
      authConfig = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    }
    this._hexaAPI = new APIClient(this.context.server, authConfig)
  }

  configureHexaSSE(): void {
    this._hexaSSE = new SSEClient(this.context.sse)
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

    this.configureHexaAPI()
    this.configureHexaSSE()
  }
}
