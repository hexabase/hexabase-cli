import {Command, flags} from '@oclif/command'
import {prompt} from 'enquirer'
import chalk from 'chalk'
import Conf from 'conf'

export default class ContextsDelete extends Command {
  private questions = [
    {
      type: 'select',
      name: 'context',
      message: 'Select the context to delete',
      choices: [],
    },
  ]

  static description = 'delete context entries'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [
    {
      name: 'context',
      description: 'context name',
    },
  ]

  hexaConfig = new Conf()

  async run() {
    const {args} = this.parse(ContextsDelete)

    const contexts = this.hexaConfig.get('contexts')
    if (!contexts) {
      return this.log('No context found')
    }

    if (!args.context) {
      this.questions[0].choices = Object.keys(contexts as string[]) as never[]
      const {context}: {context: string} = await prompt(this.questions[0])
      args.context = context
    }

    if (!Object.keys(contexts as string[]).includes(args.context)) {
      throw new Error('No such context')
    }

    this.hexaConfig.delete(`contexts.${args.context}`)
    this.log(`Context deleted successfully: ${chalk.cyan(args.context)}`)
  }
}
