import {Octokit} from '@octokit/rest'
import {createTokenAuth} from '@octokit/auth-token'
import Conf from 'conf'

const config = new Conf()
let octokit: Octokit

class Github {
  getClient(): Octokit {
    return octokit
  }

  setClient(token: string): Octokit {
    octokit = new Octokit({
      auth: token,
    })
    return octokit
  }

  getStoredToken(): string | undefined {
    return config.get('github.token') as string | undefined
  }

  async getAuthToken(): Promise<string | undefined> {
    const auth = createTokenAuth('')
    try {
      const res = await auth()

      if (res.token) {
        config.set('github.token', res.token)
        return res.token
      }
    } catch (error) {
      throw error
    }
  }
}

const github = new Github()
export default github
