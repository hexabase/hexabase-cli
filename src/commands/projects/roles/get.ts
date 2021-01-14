import {flags} from '@oclif/command'
import {cli} from 'cli-ux'
import * as rl from '../../../api/roles/roles'
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
      name: 'projectId',
      description: 'project_id from hexabase',
      required: true,
    },
  ]

  async run() {
    const {args, flags} = this.parse(ProjectsRolesGet)

    const roles = await rl.get(this.currentContext, args.projectId)

    const columns = {
      role_id: {
        header: 'ID',
        minWidth: 25,
      },
      display_id: {
        header: 'DISPLAY_ID',
        minWidth: 20,
      },
      name: {
        header: 'NAME',
        minWidth: 20,
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
