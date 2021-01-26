import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import chalk from 'chalk'
import BaseWithContext from '../../base-with-context'
import {GetTemplatesCategoryResponse} from '../../api/models/templates'
import {CreateProjectData, CreateProjectResponse, ProjectName} from '../../api/models/projects'

export default class ProjectsCreate extends BaseWithContext {
  private questions = [
    {
      type: 'select',
      name: 'template',
      message: 'Select a template',
      choices: [],
    },
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

  static description = 'create new project within current workspace'

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
  }

  async run() {
    this.parse(ProjectsCreate)

    let url = '/api/v0/templates'
    const {data: templates} = await this.hexaapi.get<GetTemplatesCategoryResponse>(url)
    const initalChoice = [{
      name: 'none',
      message: 'none',
      value: 'none',
      hint: '',
    }]
    this.questions[0].choices = templates.categories.reduce((acc, ctg) => {
      ctg.templates.forEach(tmp => {
        const elem = {
          name: tmp.tp_id,
          message: tmp.name,
          hint: tmp.tp_id,
        } as never
        acc.push(elem)
      })
      return acc
    }, initalChoice) as never[]
    const {template: template_id}: {template: string} = await prompt(this.questions[0])

    const {projectName}: {projectName: ProjectName} = await prompt(this.questions[1])
    this.log(`Project Name (en): ${chalk.cyan(projectName.en)}`)
    this.log(`Project Name (ja): ${chalk.cyan(projectName.ja)}`)

    const data: CreateProjectData = {name: projectName}
    if (template_id !== 'none') {
      data.tp_id = template_id
    }
    url = '/api/v0/applications'
    const {data: project} = await this.hexaapi.post<CreateProjectResponse>(url, data)
    this.log(`Task successfully queued. project_id set to: ${chalk.cyan(project.project_id)}`)
  }
}
