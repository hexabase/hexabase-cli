import {flags} from '@oclif/command'
import {cli} from 'cli-ux'
import BaseWithContext from '../../base-with-context'
import {GetCurrentWorkspaceResponse} from '../../api/models/workspaces'
import {GetProjectsElemResponse} from '../../api/models/projects'

export default class ProjectsGet extends BaseWithContext {
  static description = 'get projects in current workspace'

  static aliases = ['pj', 'projects']

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(ProjectsGet)

    let url = '/api/v0/workspacecurrent'
    const {data: currentWorkspace} = await this.hexaAPI.get<GetCurrentWorkspaceResponse>(url)

    url = `/api/v0/workspaces/${currentWorkspace.workspace_id}/applications`
    const {data: projects} = await this.hexaAPI.get<GetProjectsElemResponse[]>(url)

    const columns = {
      application_id: {
        header: 'ID',
      },
      display_id: {
        header: 'DISPLAY_ID',
      },
      name: {
        header: 'NAME',
      },
    }

    cli.table(projects, columns, {
      printLine: this.log,
      ...flags,
    })
  }
}
