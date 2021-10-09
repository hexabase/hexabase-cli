import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import chalk from 'chalk'
import BaseWithContext from '../../base-with-context'
import {GetCurrentWorkspaceResponse} from '../../api/models/workspaces'
import {GetProjectsElemResponse, CreateNewProjectTemplateData, CreateNewProjectTemplateResponse, TemplateForm} from '../../api/models/projects'

export default class ProjectsSave extends BaseWithContext {
  private questions = [
    {
      type: 'select',
      name: 'project',
      message: 'Select a project',
      choices: [],
    },
    {
      type: 'form',
      name: 'templateForm',
      message: 'Please provide details for your project template',
      choices: [
        {name: 'name', message: 'Name', validate(value: string) {
          return value.length > 0
        }},
        {name: 'category', message: 'Category', validate(value: string) {
          return value.length > 0
        }},
        {name: 'description', message: 'Description'},
      ],
      validate(value: any) {
        return (value.name.length > 0 && value.category.length > 0) ? true : 'Cannot be empty'
      },
    },
    {
      type: 'toggle',
      name: 'includeHistories',
      message: 'Include histories',
      enabled: 'Yes',
      disabled: 'No',
    },
  ]

  static description = 'save template from a project'

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
  }

  static args = [
    {
      name: 'project_id',
      description: 'project_id from hexabase',
    },
  ]

  async run() {
    const {args} = this.parse(ProjectsSave)

    if (!args.project_id) {
      let url = '/api/v0/workspacecurrent'
      const {data: currentWorkspace} = await this.hexaapi.get<GetCurrentWorkspaceResponse>(url)

      url = `/api/v0/workspaces/${currentWorkspace.workspace_id}/applications`
      const {data: projects} = await this.hexaapi.get<GetProjectsElemResponse[]>(url)

      if (projects.length === 0) {
        return this.log(chalk.red('No project found'))
      }

      this.questions[0].choices = projects.reduce((acc, pj) => {
        const elem = {
          name: pj.application_id,
          message: pj.name,
          value: pj.application_id,
          hint: pj.application_id,
        } as never
        acc.push(elem)
        return acc
      }, []) as never[]
      const {project: project_id}: {project: string} = await prompt(this.questions[0])
      args.project_id = project_id
    }

    const {templateForm}: {templateForm: TemplateForm} = await prompt(this.questions[1])
    this.log(`Name: ${chalk.cyan(templateForm.name)}`)
    this.log(`Category: ${chalk.cyan(templateForm.category)}`)
    if (templateForm.description !== '') {
      this.log(`Description: ${chalk.cyan(templateForm.description)}`)
    }
    const {includeHistories}: {includeHistories: boolean} = await prompt(this.questions[2])

    const data: CreateNewProjectTemplateData = {
      project_id: args.project_id,
      include_histories: includeHistories,
      ...templateForm,
    }
    const url = '/api/v0/templates'
    const {data: template} = await this.hexaapi.post<CreateNewProjectTemplateResponse>(url, data)

    this.log(`Task successfully queued. stream_id is: ${chalk.cyan(template.stream_id)}`)
  }
}
