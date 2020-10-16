import {Command} from '@oclif/command'
import * as decompress from 'decompress'
import {readdirSync, renameSync} from 'fs'
import github from '../../api/github/github'

const getGithubToken = async () => {
  let token: string | undefined = github.getStoredToken()
  if (token) {
    return token
  }

  token = await github.getAuthToken()
  return token
}

export default class Init extends Command {
  static description = 'initialize a new app'

  async run() {
    let gh = github.getClient()
    if (!gh) {
      const token = await getGithubToken()
      if (!token) {
        this.error('Could not get auth token for github')
      }
      gh = github.setClient(token)
    }
    const param = {
      owner: 'b-eee',
      repo: 'hexa-vue-example1',
      archive_format: 'zipball',
      ref: '',
    }
    try {
      const result = await gh.repos.downloadArchive(param)
      await decompress(Buffer.from(result.data, 'base64'), '.')

      const directories = readdirSync('.', {withFileTypes: true})
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

      if (directories.length !== 1) {
        throw new Error('Content of repository archive is wrong')
      }
      renameSync(directories[0], 'vue-app')
    } catch (error) {
      if (error) {
        this.error(error)
      }
    }
  }
}
