import { flags } from "@oclif/command";
import {prompt} from 'enquirer'
import cli from 'cli-ux'
import chalk from 'chalk'
import download from 'download'
import BaseWithContext from "../../../base-with-context";
import {GetDatastoreSetting} from '../../../api/models/datastores'
import {ProjectSettings} from '../../../api/models/projects'
import {GetDatastoresElemResponse} from '../../../api/models/datastores'
import {GetActionSettingsResponse} from '../../../api/models/actions'
import fs = require('fs')

export default class DownloadSettings extends BaseWithContext{
  private questions = [
    {
      type: 'input',
      name: 'output',
      message: `Specify the ${chalk.cyan('output')} of the setting file`,
      initial: 'settings',
      validate: function (input: string) {
        if (input.length === 0) {
          return 'Cannot be empty'
        }
        return input.length !== 0
      },
    },
    {
      type: 'text',
      name: 'isoverride',
      message: 'Select your optional',
    },
    {
      type: 'text',
      name: 'newnamefile',
      message: 'Enter new name file',
    },
  ]
  static description = 'download setting'

  static aliases = ['pj:settings:get']

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
    output: flags.string({ char: 'o', description: 'output folder'}),
    type: flags.string({
      char: 't',
      description: 'type download setting: application - datastore - action',
      options: ['application', 'datastore', 'action'],
      required: true,
    }),
  }

  static args = [
    {
      name: 'project_id',
      description: 'Project id from hexabase',
    },
    {
      name: 'datastore_id',
      description: 'Datastore id from hexabase',
    },
    {
      name: 'action_id',
      description: 'Action id from hexabase',
    },
  ]

  async saveFile(path:string, nameFile: string, data:any){
    fs.mkdirSync(path, { recursive: true });
    fs.writeFile (`${path}/${nameFile}.json`, JSON.stringify(data, null, 2), function(err) {
      if (err) throw err;
      console.log('complete');
    });
  }

  async saveSetting(path:string, nameFile: string, data: any) {
    if (!fs.existsSync(`${path}/${nameFile}.json`)){
      await this.saveFile(path, nameFile, data)
    } else {
      this.questions[1].message = `specified project already in your folder "${nameFile}". overwrite? :  Y/n`
      const {isoverride: isoverride}: {isoverride: string} = await prompt(this.questions[1])
      if(isoverride === 'y' || isoverride === 'Y') {
        try {
          fs.writeFileSync(`${path}/${nameFile}.json`, JSON.stringify(data, null, 2),{encoding:'utf8',flag:'w'})
          console.log('Complete save file override')
        } catch {
          console.log(this.error)
        }

      }else if(isoverride === 'n' || isoverride === 'N'){
        const {newnamefile: newnamefile}: {newnamefile: string} = await prompt(this.questions[2])
        console.log('newnamefile', newnamefile)
        await this.saveFile(path, newnamefile, data)
      }
    }
  }

  async getDataAppSetting(projectid: string){
    let url = `/api/v0/applications/${projectid}/settings`
    const {data: projects} = await this.hexaAPI.get<ProjectSettings>(url)
    try {
      const displayApp = projects.display_id ? projects.display_id : projectid
      return {displayApp, projects}
    }catch (e) {
      throw e;
    }
  }

  async getNameDatastore(projectid: string, datastoreid: string){
    let url = `/api/v0/applications/${projectid}/datastores`
    const {data: datastores} = await this.hexaAPI.get<[GetDatastoresElemResponse]>(url)
    try {
      for(let datastore of datastores){
        if(datastore.datastore_id === datastoreid){
          return datastore.display_id ? datastore.display_id : datastoreid
        }
      }
      return datastoreid
    }catch (e) {
      throw e;
    }
  }

  async run() {
    const {args, flags} = this.parse(DownloadSettings)
    const noOutputFolder = typeof flags.output === 'undefined'
    if (Object.keys(flags).length === 0 && typeof flags === 'object') {
      throw new Error('At least one flag needed, (special -t)')
    }
    if (Object.keys(args).length === 0 ) {
      throw new Error('At least one arg needed')
    }
    const typeDownload = flags.type
    console.log('flags', typeDownload)
    if (!['application', 'datastore', 'action'].includes(typeDownload)) {
      throw new Error('Flag -t is one of application, datastore, action ')
    }
    const {project_id, datastore_id, action_id} = args
    try {
      if (noOutputFolder) {
        this.questions[0].initial = 'settings'
        flags.output = await prompt(this.questions[0]).then(({output}: any) => output)
      }
      let url = ''
      if (typeDownload === 'application' && project_id) {
        console.log('downloading application setting...')
        const {displayApp, projects} = await this.getDataAppSetting(project_id);
        this.saveSetting(`${flags.output}/${displayApp}`, displayApp, projects)
      }
      else if (typeDownload === 'datastore' && datastore_id) {
        console.log('downloading datastore setting...')
        url = `/api/v0/datastores/${datastore_id}/setting`
        const {data: datastoreSetting} = await this.hexaAPI.get<GetDatastoreSetting>(url)
        const {displayApp} = await this.getDataAppSetting(datastoreSetting.p_id);
        const distinationPath = datastoreSetting.display_id ? datastoreSetting.display_id : datastore_id
        this.saveSetting(`${flags.output}/${displayApp}/${distinationPath}`, distinationPath, datastoreSetting)
      }
      else if (typeDownload === 'action' && datastore_id && action_id) {
        console.log('downloading action setting...')
        url = `/api/v0/datastores/${datastore_id}/actions/${action_id}`
        const {data: actionSetting} = await this.hexaAPI.get<GetActionSettingsResponse>(url)
        const {project_id} = actionSetting
        if(datastore_id && project_id) {
          const {displayApp} = await this.getDataAppSetting(project_id);
          const distinationPath = actionSetting.display_id ? actionSetting.display_id : action_id

          const nameDatastore = await this.getNameDatastore(project_id, datastore_id)
          console.log(displayApp, actionSetting, nameDatastore)
          this.saveSetting(`${flags.output}/${displayApp}/${nameDatastore}/${distinationPath}`, distinationPath, actionSetting)
        }
      }
      else {
        throw new Error(` with application: -t=application project_id.
        with datastore: -t=datastore null datastore_id.
        with action: -t=action null datastore_id action_id`)
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
      filename: `${filename}.json`,
      headers: {
        accept: 'application/javascript',
        authorization: `Bearer ${token}`,
      },
    }
    await download(url, dir, downloadOptions)
  }
}
