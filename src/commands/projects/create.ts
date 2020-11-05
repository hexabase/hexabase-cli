import {flags} from '@oclif/command'
import {prompt}  from 'enquirer'
import chalk from 'chalk'
import * as tmp from '../../api/projects/templates'
import * as pj from '../../api/projects/projects'
import {CreateProjectData, ProjectName} from '../../api/projects/projects'
import BaseWithContext from '../../base-with-context'

const questions = [
  {
    type: 'select',
    name: 'template',
    message: 'Select a template',
    choices: [],
  },
  {
    type: 'form',
    name: 'pj_name',
    message: 'Please provide a name for your project',
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

export default class ProjectsCreate extends BaseWithContext {
  static description = 'create new project within current workspace'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    this.parse(ProjectsCreate)

    const templateCategories = await tmp.get(this.getApiServer())
    const initalChoice = [{
      name: 'none',
      message: 'none',
      value: 'none',
      hint: '',
    }]
    questions[0].choices = templateCategories.reduce((acc, ctg) => {
      ctg.templates.forEach(tmp => {
        const elem = {
          name: tmp.tp_id,
          message: `${tmp.name}`,
          value: tmp.tp_id,
          hint: tmp.tp_id,
        } as never
        acc.push(elem)
      })
      return acc
    }, initalChoice) as never[]
    const {template: template_id}: {template: string} = await prompt(questions[0])

    const {pj_name}: {pj_name: ProjectName} = await prompt(questions[1])
    this.log(`Project Name (en): ${chalk.cyan(pj_name.en)}`)
    this.log(`Project Name (ja): ${chalk.cyan(pj_name.ja)}`)

    const data: CreateProjectData = {
      name: {
        en: pj_name.en,
        ja: pj_name.ja,
      },
    }
    if (template_id && template_id !== 'none') {
      data.tp_id = template_id
    }
    const {p_id} = await pj.create(this.getApiServer(), data)
    if (p_id) {
      this.log(`Task successfully queued. project_id set to: ${chalk.cyan(p_id)}`)
    }
  }
}
