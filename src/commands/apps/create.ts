import {Command, flags} from '@oclif/command'
import {readdirSync} from 'fs'
import {prompt} from 'enquirer'
import {spawn} from 'yarn-or-npm'
import cli from 'cli-ux'
import download from 'download'
import path from 'path'
import chalk from 'chalk'

interface UrlMap {
  [key: string]: string;
}

const urlMap: UrlMap = {
  vue: 'https://github.com/b-eee/hexa-vue-example1/archive/develop.zip',
}

export default class AppsCreate extends Command {
  private questions = [
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
    {
      type: 'select',
      name: 'template',
      message: 'Select a template',
      choices: ['vue'],
    },
  ]

  static description = 'download & create new app from a template';

  static flags = {
    help: flags.help({char: 'h'}),
    name: flags.string({char: 'n', description: 'name of your app'}),
  };

  async run() {
    const {flags} = this.parse(AppsCreate)
    const noNameFlag = typeof flags.name === 'undefined'
    try {
      // prompt: name (if not specified as flag --name)
      if (noNameFlag) {
        flags.name = await prompt(this.questions[0]).then(({name}: any) => name)
      }
      // check if folder already exists
      const isExistsDir = readdirSync('.', {withFileTypes: true}).some(
        dirent => dirent.isDirectory() && dirent.name === flags.name
      )
      if (isExistsDir) {
        throw new Error('Folder with same name already exists')
      }

      // prompt: template
      const {template}: { template: string } = await prompt(this.questions[1])

      // download from github
      cli.action.start(`Initializing app with name ${chalk.cyan(flags.name)}`)
      const url = urlMap[template]
      const downloadOptions = {
        extract: true,
        strip: 1,
        mode: '666',
        headers: {
          accept: 'application/zip',
        },
      }
      await download(url, flags.name, downloadOptions)
      cli.action.stop()

      // install npm packages of app
      const name = flags.name as string
      const outDir = path.join(process.cwd(), name)
      process.chdir(outDir)
      cli.action.start('Installing dependencies')
      spawn.sync(['install'], {stdio: 'inherit'})
      cli.action.stop()
    } finally {
      if (noNameFlag) {
        this.log(
          "You can specify the name of your app with the '--name' flag in the future"
        )
      }
    }
  }
}
