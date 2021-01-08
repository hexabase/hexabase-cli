import {flags} from '@oclif/command'
import {cli} from 'cli-ux'
import * as ws from '../../api/workspaces/workspaces'
import * as pj from '../../api/projects/projects'
import BaseWithContext from '../../base-with-context'

export default class ProjectsGet extends BaseWithContext {
  static description = 'get projects in current workspace'

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
    ...cli.table.flags(),
  }

  async run() {
    const {flags} = this.parse(ProjectsGet)

    const currentWorkspace = await ws.current(this.currentContext)
    const projects = await pj.get(this.currentContext, currentWorkspace.workspace_id)

    const columns = {
      application_id: {
        header: 'ID',
        minWidth: 25,
      },
      display_id: {
        header: 'DISPLAY_ID',
        minWidth: 20,
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
