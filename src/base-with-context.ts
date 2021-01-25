import {Command, flags} from '@oclif/command'
import {Input} from '@oclif/parser'
import Conf from 'conf'
import chalk from 'chalk'
import {APIClient} from './api/api-client'

export interface Context{
  server: string;
  sse: string;
}

const config = new Conf()

export default abstract class BaseWithContext extends Command {
  static flags = {
    context: flags.string({char: 'c', description: 'use provided context instead of currently set context'}),
  };

  private _hexaapi: APIClient = new APIClient('', '')

  private _context: Context = {server: '', sse: ''}

  get hexaapi(): APIClient {
    return this._hexaapi
  }

  async init() {
    const {flags} = this.parse(this.constructor as Input<typeof BaseWithContext.flags>)

    let currentContext: string | flags.IOptionFlag<string|undefined>
    if (flags.context) {
      currentContext = flags.context
    } else {
      currentContext = config.get('current-context') as string
      if (!currentContext) {
        throw new Error(`Missing context setting: ${chalk.red('current-context')}`)
      }
    }

    const context = config.get(`contexts.${currentContext}`)
    if (!context) {
      throw new Error(`No such context: ${chalk.red(flags.context)}`)
    }
    this._context = context as Context

    const token = config.get(`hexabase.${currentContext}.token`)
    if (!token) {
      throw new Error('Could not get login info')
    }
    this._hexaapi = new APIClient(this._context.server, token as string)
  }
}
