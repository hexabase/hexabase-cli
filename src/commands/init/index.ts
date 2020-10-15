import {Command} from '@oclif/command'
import github from '../../api/github/github'
import * as decompress from 'decompress'
import {readdirSync, renameSync} from 'fs'

const getGithubToken = async () => {
  let token = github.getStoredToken()
  if (token) {
    return token
  }

  token = await github.getAuthToken()
  return token
}

export default class Init extends Command {
  static description = 'initialize a new app'

  async run() {
    const token = await getGithubToken()
    const gh = github.setClient(token)
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
        this.log(error)
      }
    }
  }
}
