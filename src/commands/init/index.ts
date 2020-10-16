import {Command} from '@oclif/command'
import {Octokit} from '@octokit/rest'
import * as decompress from 'decompress'
import {readdirSync, renameSync} from 'fs'

export default class Init extends Command {
  static description = 'initialize a new app'

  async run() {
    const gh = new Octokit()
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
        switch (error.status) {
        case 401:
          throw new Error('Forbidden')
        default:
          throw error
        }
      }
    }
  }
}
