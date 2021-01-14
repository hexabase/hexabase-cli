import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import chalk from 'chalk'
import * as ws from '../../api/workspaces/workspaces'
import BaseWithContext from '../../base-with-context'

const questions = [
  {
    type: 'select',
    name: 'workspace',
    message: 'Select your workspace',
    choices: [],
  },
]

export default class WorkspacesUse extends BaseWithContext {
  static description = 'set current workspace in hexabase'

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
  }

  static args = [
    {
      name: 'workspaceId',
      description: 'workspace_id from hexabase',
    },
  ]

  async run() {
    const {args} = this.parse(WorkspacesUse)

    const workspaceResponse = await ws.get(this.currentContext)
    if (!args.workspaceId) {
      questions[0].choices = workspaceResponse.workspaces.map(ws => {
        return {
          name: ws.workspace_id,
          message: ws.workspace_name,
          hint: ws.workspace_id,
        }
      }) as never[]
      const {workspace: workspace_id}: {workspace: string} = await prompt(questions[0])
      args.workspaceId = workspace_id
    }

    const result = await ws.select(this.currentContext, args.workspaceId)
    if (result) {
      const currentWorkspace = workspaceResponse.workspaces.find((ws): boolean => {
        return ws.workspace_id === args.workspaceId
      })
      this.log(`Current-workspace set to: ${currentWorkspace ?
        chalk.cyan(currentWorkspace.workspace_name) :
        chalk.red('could not be determined')}`)
    }
  }
}
