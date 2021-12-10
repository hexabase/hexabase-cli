import { flags } from "@oclif/command";
import {prompt} from 'enquirer'
import cli from 'cli-ux'
import chalk from 'chalk'
import download from 'download'
import BaseWithContext from "../../../base-with-context";
import {GetDatastoreSetting} from '../../../api/models/datastores'
import {ActionSettings} from '../../../api/models/actions'
import {ProjectSettings, ProjectInfo, ProjectDatastoreInfo} from '../../../api/models/projects'
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
      description: 'type download setting is one of the following options: [application, datastore, action] ',
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

  // save file
  async saveFile(path:string, nameFile: string, data:any){
    fs.mkdirSync(path, { recursive: true });
    fs.writeFile (`${path}/${nameFile}.json`, JSON.stringify(data, null, 2), function(err) {
      if (err) throw err;
      console.log(`completed save file: ${path}/${nameFile}.json`);
    });
  }

  // save data setting to file
  async saveSetting(path:string, nameFile: string, data: any) {
    if (!fs.existsSync(`${path}/${nameFile}.json`)){
      await this.saveFile(path, nameFile, data)
    } else {
      this.questions[1].message = `specified name file already in your folder "${nameFile}". overwrite? :  Y/n`
      let keyPress:string = ''
      while (!['y','Y','n','N'].includes(keyPress)){
        const {isoverride: isoverride}: {isoverride: string} = await prompt(this.questions[1])
        keyPress = isoverride
        console.log("Your key: ", keyPress)
      }
      if(keyPress === 'y' || keyPress === 'Y') {
        try {
          fs.writeFileSync(`${path}/${nameFile}.json`, JSON.stringify(data, null, 2),{encoding:'utf8',flag:'w'})
          console.log(`Complete save file override: ${path}/${nameFile}.json!`)
        } catch {
          console.log(this.error)
        }

      }else if(keyPress === 'n' || keyPress === 'N'){
        const {newnamefile: newnamefile}: {newnamefile: string} = await prompt(this.questions[2])
        await this.saveFile(path, newnamefile, data)
      }
    }
  }

  // get data application setting
  async getDataAppSetting(projectid: string){
    let url = `/api/v0/applications/${projectid}/setting`
    const {data: projects} = await this.hexaAPI.get<ProjectSettings>(url)
    try {
      const displayApp = projects.display_id ? projects.display_id : projectid
      return {displayApp, projects}
    }catch (e) {
      throw e;
    }
  }

    // get application and display_id applicaiton by datastore_id
  async getAppByDatastoreId(datastoreId: string){
    let url = `/api/v0/applications/datastores/${datastoreId}`
    const {data: projects} = await this.hexaAPI.get<ProjectInfo>(url)
    try {
      const displayApp = projects.display_id ? projects.display_id :  projects.p_id
      return {displayApp, projects}
    }catch (e) {
      throw e;
    }
  }

  // get display_id of application and datastore by datastore_id
  async getAppAndDatastore(datastoreId: string){
    let url = `/api/v0/applications/datastore/${datastoreId}`
    const {data: data} = await this.hexaAPI.get<ProjectDatastoreInfo>(url)
    try {
      const displayApp = data.project.display_id ? data.project.display_id :  data.project.p_id
      const displayDatastore = data.datastore.display_id ? data.datastore.display_id :  datastoreId
      return {displayApp, displayDatastore}
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
    if (!['application', 'datastore', 'action'].includes(typeDownload)) {
      throw new Error('Flag -t is one of application, datastore, action ')
    }
    const {project_id, datastore_id} = args
    try {
      if (noOutputFolder) {
        this.questions[0].initial = 'settings'
        flags.output = await prompt(this.questions[0]).then(({output}: any) => output)
      }
      let url = ''
      if (typeDownload === 'application' && project_id) {
        console.log('downloading application setting...')
        url = `/api/v0/applications/${project_id}/setting`
        const {data: projects} = await this.hexaAPI.get<ProjectSettings>(url)
        const displayApp = projects.display_id ? projects.display_id : project_id
        this.saveSetting(`${flags.output}/${displayApp}`, "app-settings", projects)
      }
      else if (typeDownload === 'datastore' && datastore_id) {
        console.log('downloading datastore setting...')
        url = `/api/v0/datastores/${datastore_id}/setting`
        const {data: datastoreSetting} = await this.hexaAPI.get<GetDatastoreSetting>(url)
        const {displayApp} = await this.getAppByDatastoreId(datastore_id);
        const displayDatastore = datastoreSetting.display_id ? datastoreSetting.display_id : datastore_id
        this.saveSetting(`${flags.output}/${displayApp}/${displayDatastore}`, "datastore-settings", datastoreSetting)
      }
      else if (typeDownload === 'action' && datastore_id) {
        console.log('downloading action setting...')
        url = `/api/v0/datastores/${datastore_id}/action/setting`
        const {data: actionSetting} = await this.hexaAPI.get<ActionSettings>(url)
        const {displayApp, displayDatastore} = await this.getAppAndDatastore(datastore_id);
        this.saveSetting(`${flags.output}/${displayApp}/${displayDatastore}`, "action-settings", actionSetting)
      }
      else {
        throw new Error(` with application: -t=application project_id.
        with datastore: -t=datastore null datastore_id.
        with action: -t=action null datastore_id`)
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
}
