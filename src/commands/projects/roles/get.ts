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
      name: 'project_id',
      description: 'project_id from hexabase',
      required: true,
    },
  ]

  async run() {
    const {args, flags} = this.parse(ProjectsRolesGet)

    const roles = await rl.get(this.currentContext, args.project_id)

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
