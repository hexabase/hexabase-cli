import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import {cli} from 'cli-ux'
import {GetStatusesElemResponse} from '../../api/models/statuses'
import BaseWithContext from '../../base-with-context'
import {GetCurrentWorkspaceResponse} from '../../api/models/workspaces'
import {GetProjectsElemResponse} from '../../api/models/projects'
import {GetDatastoresElemResponse} from '../../api/models/datastores'

export default class StatusesGet extends BaseWithContext {
  private questions = [
    {
      type: 'select',
      name: 'project',
      message: 'Select your project',
      choices: [],
    },
    {
      type: 'select',
      name: 'datastore',
      message: 'Select a datastore',
      choices: [],
    },
  ]

  static description = 'get statuses in a datastore'

  static aliases = ['st', 'status']

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
    ...cli.table.flags(),
  }

  static args = [
    {
      name: 'datastore_id',
      description: 'datastore_id from hexabase',
      required: false,
    },
  ]

  async run() {
    const {args, flags} = this.parse(StatusesGet)

    if (!args.datastore_id) {
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

      url = `/api/v0/applications/${project_id}/datastores`
      const {data: datastores} =  await this.hexaAPI.get<GetDatastoresElemResponse[]>(url)
      this.questions[1].choices = datastores.map(ds => {
        return {
          name: ds.datastore_id,
          message: ds.name,
          hint: ds.datastore_id,
        }
      }) as never[]
      const {datastore: datastore_id}: {datastore: string} = await prompt(this.questions[1])
      args.datastore_id = datastore_id
    }

    const url = `/api/v0/datastores/${args.datastore_id}/statuses`
    const {data: statuses} = await this.hexaAPI.get<GetStatusesElemResponse[]>(url)

    const columns = {
      status_id: {
        header: 'ID',
      },
      display_id: {
        header: 'DISPLAY_ID',
      },
      name: {
        header: 'NAME',
        get: (row: GetStatusesElemResponse) => row.displayed_name,
      },
      sort_id: {
        header: 'SORT_ID',
        extended: true,
      },
      x: {
        header: 'X',
        extended: true,
      },
      y: {
        header: 'Y',
        extended: true,
      },
    }

    cli.table(statuses, columns, {
      printLine: this.log,
      ...flags,
    })
  }
}
