import {Command, flags} from '@oclif/command'
import {prompt}  from 'enquirer'
import Conf from 'conf'
import chalk from 'chalk'
import * as ws from '../../api/workspaces/workspaces'

const config = new Conf()

const questions = [
  {
    type: 'select',
    name: 'workspace',
    message: 'Select your workspace',
    choices: [],
  },
]

// TODO: Create class for Commands with currentContext checking
export default class WorkspacesUse extends Command {
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

    const currentContext = config.get('current-context')
    const apiServer = config.get(`contexts.${currentContext}.server`) as string

    if (!currentContext || !apiServer) {
      const output = []
      if (!currentContext) output.push(chalk.red('current-context'))
      if (!apiServer) output.push(chalk.red('server'))
      throw new Error(`Missing context settings: ${output.join(', ')}`)
    }

    if (!args.workspaceId) {
      const workspaces = await ws.get(apiServer)
      questions[0].choices = workspaces.map(ws => {
        return {
          name: ws.workspace_id,
          message: `${ws.workspace_name}`,
          value: ws.workspace_id,
          hint: `${ws.workspace_id}`,
        }
      }) as never[]
      const {workspace: workspace_id}: {workspace: string} = await prompt(questions[0])
      args.workspaceId = workspace_id
    }

    const result = await ws.select(apiServer as string, args.workspaceId)
    if (result) {
      this.log(`Current-workspace successfully set to: ${chalk.cyan(args.workspaceId)}`)
    }
  }
}
