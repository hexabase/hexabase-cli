import {flags} from '@oclif/command'
import {prompt}  from 'enquirer'
import {cli} from 'cli-ux'
import * as ws from '../../api/workspaces/workspaces'
import * as pj from '../../api/projects/projects'
import * as ds from '../../api/datastores/datastores'
import BaseWithContext from '../../base-with-context'

const questions = [
  {
    type: 'select',
    name: 'project',
    message: 'Select your project',
    choices: [],
  },
]

export default class DatastoresGet extends BaseWithContext {
  static description = 'get datastores within a project'

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
    ...cli.table.flags(),
  }

  static args = [
    {
      name: 'projectId',
      description: 'project_id from hexabase',
    },
  ]

  async run() {
    const {args, flags} = this.parse(DatastoresGet)

    if (!args.projectId) {
      const currentWorkspace = await ws.current(this.currentContext)
      const projects = await pj.get(this.currentContext, currentWorkspace.workspace_id)
      questions[0].choices = projects.map(pj => {
        return {
          name: pj.application_id,
          message: pj.name,
          hint: pj.application_id,
        }
      }) as never[]
      const {project: project_id}: {project: string} = await prompt(questions[0])
      args.projectId = project_id
    }

    const datastores = await ds.get(this.currentContext, args.projectId)

    const columns = {
      datastore_id: {
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
      deleted: {
        header: 'DELETED',
        extended: true,
      },
    }

    cli.table(datastores, columns, {
      printLine: this.log,
      ...flags,
    })
  }
}
