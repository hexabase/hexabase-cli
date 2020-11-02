import {Command, flags} from '@oclif/command'

export default class Create extends Command {
  static description = 'create new project within current workspace'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    const {flags} = this.parse(Create)
  }
}
