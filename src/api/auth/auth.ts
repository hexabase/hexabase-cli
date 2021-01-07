import axios from 'axios'
import Conf from 'conf'
import {Context} from '../../base-with-context'

const config = new Conf()

export const login = async (currentContext: string, email: string, password: string): Promise<string> => {
  try {
    const context = config.get(`contexts.${currentContext}`) as Context
    const url = `${context.server}/api/v0/login`
    const {data: {token}} = await axios.post(url, {email, password})
    return token
  } catch (error) {
    throw error
  }
}
