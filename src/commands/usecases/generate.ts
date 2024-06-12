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
      name: 'requirement',
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
      choices: ['Generate Job Matching SaaS Application', 'Generate Web site with Information Board and Blog Application'],
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
      name: 'prompt',
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
      prompt: queryString,
    }

    cli.action.start(`Generating UseCases. This may take a while`)
    const {data: usecasesResponse} = await this.hexaModeler.post<GenerateUseCasesResponse>(url, postData)

  
    // Display the Results
    this.log(`---- SYSTEM NAME ----`);
    this.log(`${usecasesResponse.result.name}`);
    this.log(`---- GOAL ----`);
    this.log(`${usecasesResponse.result.goal}`);
    this.log(`---- DESCRIPTION ----`);
    this.log(`${usecasesResponse.result.description}`);
    
    this.log(`---- ACTORS ----`);
    const actorsColumns = {
      id: {
        header: 'Actor ID',
      },
      name: {
        header: 'Actor Name',
      },
      type: {
        header: 'Type',
      },
      description: {
        header: 'Description',
      },
    }
    cli.table(usecasesResponse.result.actors, actorsColumns, {
      printLine: this.log,
      ...flags,
    })
    
    this.log(`---- USER INTERFACES(SCREENS) ----`);
    const userInterfaceColumns = {
      id: {
        header: 'ID',
      },
      name: {
        header: 'UI Name',
      },
      type: {
        header: 'Type',
      },
      description: {
        header: 'Description',
      },
    }
    cli.table(usecasesResponse.result.user_interfaces, userInterfaceColumns, {
      printLine: this.log,
      ...flags,
    })


    this.log(`---- SYSTEM INTERFACES to External systems ----`);
    const systemInterfaceColumns = {
      id: {
        header: 'ID',
      },
      name: {
        header: 'IF Name',
      },
      type: {
        header: 'Type',
      },
      description: {
        header: 'Description',
      },
    }
    cli.table(usecasesResponse.result.system_interfaces, systemInterfaceColumns, {
      printLine: this.log,
      ...flags,
    })

    // Display the Usecases Results
    this.log(`---- USE CASES ----`);
    const columns = {
      id: {
        header: 'ID',
      },
      title: {
        header: 'Title',
      },
      actors: {
        header: 'Actors',
      },
      user_interfaces: {
        header: 'User Interfaces',
      },
      system_interfaces: {
        header: 'System Interfaces',
      },
      description: {
        header: 'Description',
      },
    }
    cli.table(usecasesResponse.result.usecases, columns, {
      printLine: this.log,
      ...flags,
    })

    cli.action.stop()
    this.log(`Generated: ${usecasesResponse.result.usecases.length} UseCases. Total Tokens: ${usecasesResponse.total_tokens}`)

  }
}
