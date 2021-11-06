import {flags} from '@oclif/command'
import {cli} from 'cli-ux'
import {GetProjectRolesElemResponse} from '../../../api/models/roles'
import BaseWithContext from '../../../base-with-context'

export default class ProjectsRolesGet extends BaseWithContext {
  static description = 'get roles of a project'

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
    ...cli.table.flags(),
  }

  static args = [
    {
      name: 'project_id',
      description: 'project_id from hexabase',
      required: true,
    },
  ]

  async run() {
    const {args, flags} = this.parse(ProjectsRolesGet)

    const url = `/api/v0/applications/${args.project_id}/roles`
    const {data: roles} = await this.hexaAPI.get<GetProjectRolesElemResponse[]>(url)

    const columns = {
      role_id: {
        header: 'ID',
      },
      display_id: {
        header: 'DISPLAY_ID',
      },
      name: {
        header: 'NAME',
      },
      type: {
        header: 'TYPE',
      },
    }

    cli.table(roles, columns, {
      printLine: this.log,
      ...flags,
    })
  }
}
