import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import chalk from 'chalk'
import BaseWithContext from '../../base-with-context'
import {GetWorkspacesResponse} from '../../api/models/workspaces'

export default class WorkspacesUse extends BaseWithContext {
  private questions = [
    {
      type: 'select',
      name: 'workspace',
      message: 'Select your workspace',
      choices: [],
    },
  ]

  static description = 'set current workspace in hexabase'

  static aliases = ['select', 'sel']

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
  }

  static args = [
    {
      name: 'workspace_id',
      description: 'workspace_id from hexabase',
    },
  ]

  async run() {
    const {args} = this.parse(WorkspacesUse)

    let url = '/api/v0/workspaces'
    const {data: workspaceResponse} = await this.hexaAPI.get<GetWorkspacesResponse>(url)
    if (!args.workspace_id) {
      this.questions[0].choices = workspaceResponse.workspaces.map(ws => {
        return {
          name: ws.workspace_id,
          message: ws.workspace_name,
          hint: ws.workspace_id,
        }
      }) as never[]
      const {workspace: workspace_id}: {workspace: string} = await prompt(this.questions[0])
      args.workspace_id = workspace_id
    }

    url = `/api/v0/workspaces/${args.workspace_id}/select`
    await this.hexaAPI.post<void>(url)
    const currentWorkspace = workspaceResponse.workspaces.find((ws): boolean => {
      return ws.workspace_id === args.workspace_id
    })
    this.log(`Current-workspace set to: ${currentWorkspace ?
      chalk.cyan(currentWorkspace.workspace_name) :
      chalk.red('could not be determined')}`)
  }
}
