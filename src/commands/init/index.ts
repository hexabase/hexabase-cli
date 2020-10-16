import {Command} from '@oclif/command'
import {readdirSync} from 'fs'
import {prompt}  from 'enquirer'
import cli from 'cli-ux'
import * as download from 'download'
import * as chalk from 'chalk'

interface UrlMap {
  [key: string]: string;
}

const urlMap: UrlMap = {
  vue: 'https://github.com/b-eee/hexa-vue-example1/archive/develop.zip',
}

const questions = [
  {
    type: 'select',
    name: 'template',
    message: 'Select a template',
    choices: ['vue'],
  },
  {
    type: 'input',
    name: 'name',
    message: `Specify the ${chalk.cyan('name')} of your app`,
    validate: function (input: string) {
      if (input.length === 0) {
        return 'Cannot be empty'
      }
      return input.length !== 0
    },
  },
]

export default class Init extends Command {
  static description = 'initialize a new app'

  async run() {
    try {
      const answers: Answer = await prompt(questions)
      const {template, name} = answers

      const isExistsDir = readdirSync('.', {withFileTypes: true})
      .some(dirent => dirent.isDirectory() && dirent.name === name)
      if (isExistsDir) {
        throw new Error('Folder with same name already exists')
      }

      cli.action.start(`initializing app with name ${chalk.cyan(name)}`)
      const url = urlMap[template]
      const downloadOptions = {
        extract: true,
        strip: 1,
        mode: '666',
        headers: {
          accept: 'application/zip',
        },
      }
      await download(url, name, downloadOptions)
    } catch (error) {
      this.error(error)
    } finally {
      cli.action.stop()
    }
  }
}
