import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import {cli} from 'cli-ux'
import {GetFieldsElemResponse, GetFieldsResponse} from '../../api/models/fields'
import BaseWithContext from '../../base-with-context'
import {GetCurrentWorkspaceResponse} from '../../api/models/workspaces'
import {GetProjectsElemResponse} from '../../api/models/projects'
import {GetDatastoresElemResponse} from '../../api/models/datastores'

export default class FieldsGet extends BaseWithContext {
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

  static description = 'get fields in a datastore'

  static aliases = ['fd', 'fields']

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
    const {args, flags} = this.parse(FieldsGet)

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
    }

    const url = `/api/v0/datastores/${args.datastore_id}/fields`
    const {data: fieldsResponse} = await this.hexaapi.get<GetFieldsResponse>(url)
    let fields: GetFieldsElemResponse[] = []
    if (fieldsResponse.fields) {
      // fieldsResponse is returned as an object -> convert to sorted array
      fields = Object.keys(fieldsResponse.fields)
      .map(key => fieldsResponse.fields[key])
      .sort((x, y) => x.fieldIndex - y.fieldIndex)
    }

    const columns = {
      field_id: {
        header: 'ID',
      },
      display_id: {
        header: 'DISPLAY_ID',
      },
      name: {
        header: 'NAME',
      },
      dataType: {
        header: 'DATA_TYPE',
      },
    }

    cli.table(fields, columns, {
      printLine: this.log,
      ...flags,
    })
  }
}
