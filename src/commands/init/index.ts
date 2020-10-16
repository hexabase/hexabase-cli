import {Command} from '@oclif/command'
import * as download from 'download'

export default class Init extends Command {
  static description = 'initialize a new app'

  async run() {
    try {
      const url = 'https://github.com/b-eee/hexa-vue-example1/archive/develop.zip'
      const dest = './vue-app'
      const downloadOptions = {
        extract: true,
        strip: 1,
        mode: '666',
        headers: {
          accept: 'application/zip',
        },
      }
      await download(url, dest, downloadOptions)
    } catch (error) {
      this.error(error)
    }
  }
}
