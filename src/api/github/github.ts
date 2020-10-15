import {Octokit} from '@octokit/rest'
import {createTokenAuth} from '@octokit/auth-token'
import Conf from 'conf'

const config = new Conf()
let octokit: Octokit

class Github {
  getClient() {
    return octokit
  }

  setClient(token: string) {
    octokit = new Octokit({
      auth: token,
    })
    return octokit
  }

  getStoredToken() {
    return config.get('github.token')
  }

  async getAuthToken() {
    const auth = createTokenAuth('')

    try {
      const res = await auth()

      if (res.token) {
        config.set('github.token', res.token)
        return res.token
      }
      throw new Error('GitHub token was not found in the response')
    } finally {
    }
  }
}

const github = new Github()
export default github
