import {flags} from '@oclif/command'
import {readFileSync, existsSync} from 'fs'
import {Validator} from 'jsonschema'
import {prompt} from 'enquirer'
import chalk from 'chalk'
import BaseWithContext from '../../base-with-context'
import {CreateProjectResponse, ProjectName} from '../../api/models/projects'

const v = new Validator()

const settingsSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'object',
      required: true,
      properties: {
        en: {
          type: 'string',
          minLength: 1,
          required: true,
        },
        ja: {
          type: 'string',
          minLength: 1,
          required: true,
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

export default class AppsInit extends BaseWithContext {
  private questions = [
    {
      type: 'form',
      name: 'projectName',
      message: 'Please provide the name for your project',
      choices: [
        {name: 'en', message: 'Project Name (en)', validate(value: string) {
          return value.length > 0
        }},
        {name: 'ja', message: 'Project Name (ja)', validate(value: string) {
          return value.length > 0
        }},
      ],
      validate(value: any) {
        return (value.en.length > 0 && value.ja.length > 0) ? true : 'Cannot be empty'
      },
    },
  ]

  static description = 'initialize app with hexabase settings'

  static aliases = ['init']

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
    file: flags.string({char: 'f', description: 'hexabase settings file', default: 'hx-settings.json'}),
  }

  async run() {
    const {flags} = this.parse(AppsInit)
    const hxSettingsFile = flags.file

    if (!existsSync(hxSettingsFile)) {
      throw new Error(`${chalk.red(hxSettingsFile)} file not found`)
    }
    const hxSettings = JSON.parse(readFileSync(hxSettingsFile, 'utf8'))

    // no 'name' field in hxSettings -> form prompt
    if (!Object.prototype.hasOwnProperty.call(hxSettings, 'name')) {
      const {projectName}: {projectName: ProjectName} = await prompt(this.questions[0])
      this.log(`Project Name (en): ${chalk.cyan(projectName.en)}`)
      this.log(`Project Name (ja): ${chalk.cyan(projectName.ja)}`)
      Object.assign(hxSettings, {name: projectName})
    }

    // json schema validation
    const validatorResult = v.validate(hxSettings, settingsSchema)
    if (validatorResult.errors.length > 0) {
      throw new Error(`JSON Schema\n${validatorResult.toString()}`)
    }

    const url = '/api/v0/applications'
    const {data: project} = await this.hexaAPI.post<CreateProjectResponse>(url, hxSettings)
    this.log(`Task successfully queued:
project_id: ${chalk.cyan(project.project_id)}`
    )
  }
}
