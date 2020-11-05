import {Command, flags} from '@oclif/command'
import {readFileSync, existsSync} from 'fs'
import {Validator} from 'jsonschema'
import chalk from 'chalk'
import Conf from 'conf'
import * as pj from '../../api/projects/projects'

const config = new Conf()

const settingsSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'object',
      properties: {
        en: {
          type: 'string',
          minLength: 1,
        },
        ja: {
          type: 'string',
          minLength: 1,
        },
      },
    },
    tp_id: {
      type: 'string',
      minLength: 1,
      required: true,
    },
  },
}
const v = new Validator()

// TODO: Create class for Commands with currentContext checking
export default class AppsInit extends Command {
  static description = 'initialize app with hexabase settings'

  static aliases = ['init']

  static flags = {
    help: flags.help({char: 'h'}),
    file: flags.string({char: 'f', description: 'hexabase settings file', default: 'hx-settings.json'}),
  }

  async run() {
    const {flags} = this.parse(AppsInit)
    const hxSettingsFile = flags.file

    const currentContext = config.get('current-context')
    const apiServer = config.get(`contexts.${currentContext}.server`) as string

    if (!currentContext || !apiServer) {
      const output = []
      if (!currentContext) output.push(chalk.red('current-context'))
      if (!apiServer) output.push(chalk.red('server'))
      throw new Error(`Missing context settings: ${output.join(', ')}`)
    }

    if (!existsSync(hxSettingsFile)) {
      throw new Error(`${chalk.red(hxSettingsFile)} file not found`)
    }

    const hxSettings = JSON.parse(readFileSync(hxSettingsFile, 'utf8'))

    const validatorResult = v.validate(hxSettings, settingsSchema)
    if (validatorResult.errors.length > 0) {
      throw new Error(`JSON Schema\n${validatorResult.toString()}`)
    }

    const {p_id} = await pj.create(apiServer, hxSettings)
    if (p_id) {
      this.log(`Task successfully queued. project_id set to: ${chalk.cyan(p_id)}`)
    }
  }
}
