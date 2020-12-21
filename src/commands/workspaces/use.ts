import {flags} from '@oclif/command'
import {prompt}  from 'enquirer'
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
    help: flags.help({char: 'h'}),
  }

  static args = [
    {
      name: 'workspaceId',
      description: 'workspaceId from hexabase',
    },
  ]

  async run() {
    const {args} = this.parse(WorkspacesUse)

    if (!args.workspaceId) {
      const workspaces = await ws.get(this.getApiServer())
      questions[0].choices = workspaces.map(ws => {
        return {
          name: ws.workspace_id,
          message: ws.workspace_name,
          hint: ws.workspace_id,
        }
      }) as never[]
      const {workspace: workspace_id}: {workspace: string} = await prompt(questions[0])
      args.workspaceId = workspace_id
    }

    const result = await ws.select(this.getApiServer(), args.workspaceId)
    if (result) {
      this.log(`Current-workspace successfully set to: ${chalk.cyan(args.workspaceId)}`)
    }
  }
}
