import {Command, flags} from '@oclif/command'
import {prompt}  from 'enquirer'
import Conf from 'conf'

const config = new Conf()

const questions = [
  {
    type: 'select',
    name: 'context',
    message: 'Select your current context',
    choices: [],
  },
]

export default class ContextUse extends Command {
  static description = 'set current context'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = [{name: 'context'}] // TODO: optional

  async run() {
    this.parse(ContextUse)

    const contexts = config.get('contexts')
    if (!contexts) {
      return this.log('No context found')
    }
    questions[0].choices = Object.keys(contexts as string[]) as never[]
    const {context}: {context: string} = await prompt(questions[0])
    config.set('current-context', context)
    this.log('Current-context set successfully')
  }
}
