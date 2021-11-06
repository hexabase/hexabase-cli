import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import {cli} from 'cli-ux'
import BaseWithContext from '../../base-with-context'
import {GetCurrentWorkspaceResponse} from '../../api/models/workspaces'
import {GetProjectsElemResponse} from '../../api/models/projects'
import {GetDatastoresElemResponse} from '../../api/models/datastores'

export default class DatastoresGet extends BaseWithContext {
  private questions = [
    {
      type: 'select',
      name: 'project',
      message: 'Select your project',
      choices: [],
    },
  ]

  static description = 'get datastores within a project'

  static aliases = ['ds', 'datastores']

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
    ...cli.table.flags(),
  }

  static args = [
    {
      name: 'project_id',
      description: 'project_id from hexabase',
    },
  ]

  async run() {
    const {args, flags} = this.parse(DatastoresGet)

    if (!args.project_id) {
      let url = '/api/v0/workspacecurrent'
      const {data: currentWorkspace} = await this.hexaAPI.get<GetCurrentWorkspaceResponse>(url)

      url = `/api/v0/workspaces/${currentWorkspace.workspace_id}/applications`
      const {data: projects} = await this.hexaAPI.get<GetProjectsElemResponse[]>(url)
      this.questions[0].choices = projects.map(pj => {
        return {
          name: pj.application_id,
          message: pj.name,
          hint: pj.application_id,
        }
      }) as never[]
      const {project: project_id}: {project: string} = await prompt(this.questions[0])
      args.project_id = project_id
    }

    const url = `/api/v0/applications/${args.project_id}/datastores`
    const {data: datastores} =  await this.hexaAPI.get<GetDatastoresElemResponse[]>(url)

    const columns = {
      datastore_id: {
        header: 'ID',
      },
      display_id: {
        header: 'DISPLAY_ID',
      },
      name: {
        header: 'NAME',
      },
      deleted: {
        header: 'DELETED',
        extended: true,
      },
      imported: {
        header: 'IMPORTED',
        extended: true,
      },
      uploading: {
        header: 'UPLOADING',
        extended: true,
      },
    }

    cli.table(datastores, columns, {
      printLine: this.log,
      ...flags,
    })
  }
}
