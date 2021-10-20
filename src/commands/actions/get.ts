import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import {cli} from 'cli-ux'
import BaseWithContext from '../../base-with-context'
import {GetActionsElemResponse} from '../../api/models/actions'
import {GetCurrentWorkspaceResponse} from '../../api/models/workspaces'
import {GetProjectsElemResponse} from '../../api/models/projects'
import {GetDatastoresElemResponse} from '../../api/models/datastores'
import {GetStatusesElemResponse} from '../../api/models/statuses'

export default class ActionsGet extends BaseWithContext {
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
    {
      type: 'select',
      name: 'status',
      message: 'Select a status for the action',
      choices: [],
    },
  ]

  static description = 'get actions in a datastore'

  static aliases = ['ac']

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
    {
      name: 'status_id',
      description: 'status_id of the status action',
    },
  ]

  async run() {
    const {args, flags} = this.parse(ActionsGet)

    if (!args.datastore_id) {
      let url = '/api/v0/workspacecurrent'
      const {data: currentWorkspace} = await this.hexaapi.get<GetCurrentWorkspaceResponse>(url)

      url = `/api/v0/workspaces/${currentWorkspace.workspace_id}/applications`
      const {data: projects} = await this.hexaapi.get<GetProjectsElemResponse[]>(url)
      this.questions[0].choices = projects.map(pj => {
        return {
          name: pj.application_id,
          message: pj.name,
          hint: pj.application_id,
        }
      }) as never[]
      const {project: project_id}: {project: string} = await prompt(this.questions[0])

      url = `/api/v0/applications/${project_id}/datastores`
      const {data: datastores} =  await this.hexaapi.get<GetDatastoresElemResponse[]>(url)
      this.questions[1].choices = datastores.map(ds => {
        return {
          name: ds.datastore_id,
          message: ds.name,
          hint: ds.datastore_id,
        }
      }) as never[]
      const {datastore: datastore_id}: {datastore: string} = await prompt(this.questions[1])
      args.datastore_id = datastore_id

      url = `/api/v0/datastores/${args.datastore_id}/statuses`
      const {data: statuses} = await this.hexaapi.get<GetStatusesElemResponse[]>(url)
      this.questions[2].choices = statuses.map(st => {
        return {
          name: st.status_id,
          message: st.displayed_name,
          hint: st.status_id,
        }
      }) as never[]
      const {status: status_id}: {status: string} = await prompt(this.questions[2])
      args.status_id = status_id
    }

    let url = `/api/v0/datastores/${args.datastore_id}/actions`
    if (args.status_id) {
      url = `${url}?status_id=${args.status_id}`
    }
    const {data: actions} = await this.hexaapi.get<GetActionsElemResponse[]>(url)

    const columns = {
      action_id: {
        header: 'ID',
      },
      display_id: {
        header: 'DISPLAY_ID',
      },
      name: {
        header: 'NAME',
      },
      operation: {
        header: 'OPERATION',
      },
      is_status_action: {
        header: 'IS_STATUS_ACTION',
        extended: !args.status_id,
      },
      set_status: {
        header: 'NEXT_STATUS_ID',
        extended: false,
        get: (row: GetActionsElemResponse) => {
          return row.set_status ? row.set_status : ''
        },
      },
      status_id: {
        header: 'STATUS_ID',
        extended: true,
        get: (row: GetActionsElemResponse) => {
          return row.status_id ? row.status_id : ''
        },
      },
    }

    cli.table(actions, columns, {
      printLine: this.log,
      ...flags,
    })
  }
}
