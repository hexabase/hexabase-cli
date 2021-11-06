import { flags } from "@oclif/command";
import {prompt} from 'enquirer'
import cli from 'cli-ux'
import chalk from 'chalk'
import download from 'download'
import BaseWithContext from "../../../base-with-context";
import { GetWorkspacesResponse } from '../../../api/models/workspaces';
import { GetDatastoresInWorkSpaceResponse } from '../../../api/models/datastores';
import {ItemDetailResponse} from '../../../api/models/items';
import {GetCurrentWorkspaceResponse} from '../../../api/models/workspaces'
import {GetProjectsElemResponse} from '../../../api/models/projects'
import {GetDatastoresElemResponse} from '../../../api/models/datastores'
import {GetActionsElemResponse} from '../../../api/models/actions'

export default class ActionsScriptDownloadsAll extends BaseWithContext{
  private questions = [
    {
      type: 'input',
      name: 'output',
      message: `Specify the ${chalk.cyan('output')} of the actionscript file`,
      initial: 'download',
      validate: function (input: string) {
        if (input.length === 0) {
          return 'Cannot be empty'
        }
        return input.length !== 0
      },
    },
    {
      type: 'select',
      name: 'project',
      message: 'Select your project',
      choices: [],
    },
  ]
  static description = 'download all actionscript file'

  static aliases = ['scripts:download-all', 'as:getall', 'asall']

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
    output: flags.string({ char: 'o', description: 'output folder'})
  }

  static args = [
    {
      name: 'project_id',
      description: 'Project_id from hexabase',
    },
  ]

  async run() {
    const types = ['post', 'pre']
    const {args, flags} = this.parse(ActionsScriptDownloadsAll)
    const noOutputFolder = typeof flags.output === 'undefined'
    const token = this.hexaConfig.get(`hexabase.${this.currentContext}.token`)
    try {
      //get all application
      let url = '/api/v0/workspacecurrent'
      const {data: currentWorkspace} = await this.hexaAPI.get<GetCurrentWorkspaceResponse>(url)
      url = `/api/v0/workspaces/${currentWorkspace.workspace_id}/applications`
      const {data: projects} = await this.hexaAPI.get<GetProjectsElemResponse[]>(url)
      this.questions[1].choices = projects.map( pj => {
        return {
          name: pj.application_id,
          message: pj.name,
          hint: pj.application_id,
        }
      }) as never[]

      //get folder input and args
      if (noOutputFolder) {
        this.questions[0].initial = `download`
        flags.output = await prompt(this.questions[0]).then(({output}: any) => output)
      }
      if(!args.project_id){
        const {project: project_id}: {project: string} = await prompt(this.questions[1])
        args.project_id = project_id
      }
      const disApp = await this.getDisplayApp(args.project_id, this.questions[1].choices)
      let dirPath = flags.output ? flags.output : 'download'

      // start process get download: get datastore->action
      let urlDl = `/api/v0/applications/${args.project_id}/datastores`
      const {data: datastores} =  await this.hexaAPI.get<GetDatastoresElemResponse[]>(urlDl)
      for(let datastore of datastores){
        const disDs = datastore.display_id ? datastore.display_id : datastore.datastore_id
        urlDl = `/api/v0/datastores/${datastore.datastore_id}/actions`
        const {data: actions} = await this.hexaAPI.get<GetActionsElemResponse[]>(urlDl)
        for(let action of actions) {
          const disAc = action.display_id ? action.display_id : action.action_id
          let dir = `./${dirPath}/${disApp}/${disDs}`
          
          // download with type [post or pre]
          for (const type of types) {
            urlDl = `${this.context.server}/api/v0/actions/${action.action_id}/actionscripts/download?script_type=${type}`
            try {
              await this.downloadScript(urlDl, dir, `${disAc}-${type}`)
              console.log(`Download success ${disAc}`)
            } catch(e) {
              console.log(`Error download with action:${disAc}-${type}`)
            }
          }
        }
      }
      cli.action.stop()
    }
    catch (e) {
      throw e;
    }
    finally {
      if (noOutputFolder)
        this.log(
          "You can specify the output folder with the '--output' flag in the future"
        )
    }
  }
  
  // function get display id of application
  async getDisplayApp(checkValue: string, arrayCheck: any){
    const data = arrayCheck.find( (app:any) => {
      return app.name == checkValue
    })
    return data.message ? data.message : checkValue
  }

  // function download actionscript
  async downloadScript(url: string, dir: string, filename: string){
    const token = this.hexaConfig.get(`hexabase.${this.currentContext}.token`)
    const downloadOptions = {
      mode: '666',
      filename: `${filename}.js`,
      headers: {
        accept: 'application/javascript',
        authorization: `Bearer ${token}`,
      },
    }
    await download(url, dir, downloadOptions)
  }
}