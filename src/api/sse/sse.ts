import Conf from 'conf'
import chalk from 'chalk'
import {Context} from '../../base-with-context'

export interface SSEConnectOutput {
  source: EventSource;
  sseServer: string;
}

const config = new Conf()

export const connect = (currentContext: string, channel: string): SSEConnectOutput => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    const sseServer = context.sse
    if (!sseServer) {
      throw new Error(`Missing context setting: ${chalk.red('sse')}`)
    }

    const url = `${sseServer}/sse?channel=${channel}`
    return {
      source: new EventSource(url),
      sseServer: sseServer,
    }
  } catch (error) {
    throw error
  }
}
