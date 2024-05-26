import {flags} from '@oclif/command'
import {prompt} from 'enquirer'
import chalk from 'chalk'
import {cli} from 'cli-ux'
import BaseWithContext from '../../base-with-context'
import {GenerateUseCasesResponse} from '../../api/models/usecases'

export default class UseCasesGenerate extends BaseWithContext {
  private questions = [
    {
      type: 'input',
      name: 'requrirement',
      message: `Input the ${chalk.cyan('requirement')} for your app`,
      validate: function (input: string) {
        if (input.length === 0) {
          return 'Cannot be empty'
        }
        return input.length !== 0
      },
    },
    {
      type: 'select',
      name: 'examples',
      message: 'Select a template',
      choices: ['example1............', 'example2..................'],
    },
  ]


  static description = 'Input requrirement you want to create'

  static aliases = ['usecase', 'uc']

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
    input: flags.string({char: 'i', description: 'input requrirements text of your app'}),
  }

  static args = [
    {
      name: 'query',
      description: 'Input the requirement for your app',
    },
  ]

  async run() {
    const {flags} = this.parse(UseCasesGenerate)
    const noNameFlag = typeof flags.input === 'undefined'
    if (noNameFlag) {
      flags.input = await prompt(this.questions[0]).then(({requrirement}: any) => requrirement)
    }
    let queryString = flags.input
    let url = '/api/v0/usecases/generate' 
    let postData = {
      query: queryString,
    }

    cli.action.start(`Generating UseCases. This may take a while`)
    const {data: usecasesResponse} = await this.hexaModeler.post<GenerateUseCasesResponse>(url, postData)

    const columns = {
      id: {
        header: 'ID',
      },
      title: {
        header: 'TITLE',
      },
      actors: {
        header: 'ACTORS',
      },
      description: {
        header: 'DESCRIPTION',
      },
    }
    cli.table(usecasesResponse.result, columns, {
      printLine: this.log,
      ...flags,
    })
    cli.action.stop()
    this.log(`Generated: ${usecasesResponse.result.length} UseCases`)

  }
}
