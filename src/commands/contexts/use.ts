import {Command, flags} from '@oclif/command'
import {prompt} from 'enquirer'
import Conf from 'conf'

const config = new Conf()

export default class ContextsUse extends Command {
  private questions = [
    {
      type: 'select',
      name: 'context',
      message: 'Select your current-context',
      choices: [],
    },
  ]

  static description = 'set current-context'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [
    {
      name: 'context',
      description: 'context name',
    },
  ]

  async run() {
    const {args} = this.parse(ContextsUse)

    const contexts = config.get('contexts')
    if (!contexts) {
      return this.log('No context found')
    }

    if (args.context) {
      if (!Object.keys(contexts as string[]).includes(args.context)) {
        throw new Error('No such context')
      }
      config.set('current-context', args.context)
      return this.log('Current-context set successfully')
    }

    this.questions[0].choices = Object.keys(contexts as string[]) as never[]
    const {context}: {context: string} = await prompt(this.questions[0])
    config.set('current-context', context)
    this.log('Current-context set successfully')
  }
}
