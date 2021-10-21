import { flags } from "@oclif/command";
import {prompt} from 'enquirer'
import cli from 'cli-ux'
import chalk from 'chalk'
import download from 'download'
import BaseWithContext from "../../../../base-with-context";
import { GetWorkspacesResponse } from '../../../../api/models/workspaces';
import { GetDatastoresInWorkSpaceResponse } from '../../../../api/models/datastores';
import {ItemDetailResponse} from '../../../../api/models/items';

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
  ]
  static description = 'download all actionscript file'

  static flags = {
    ...BaseWithContext.flags,
    help: flags.help({char: 'h'}),
    output: flags.string({ char: 'o', description: 'output folder'})
  }

  async run() {
    const types = ['post', 'pre']
    const {flags} = this.parse(ActionsScriptDownloadsAll)
    const noOutputFolder = typeof flags.output === 'undefined'
    try {
      if (noOutputFolder) {
        this.questions[0].initial = `download`
        flags.output = await prompt(this.questions[0]).then(({output}: any) => output)
      }

      // get all workspace
      cli.action.start(`download all actionscript`)
      let url = '/api/v0/workspaces'
      const token = this.hexaconfig.get(`hexabase.${this.currentContext}.token`)
      const {data: datas} = await this.hexaapi.get<GetWorkspacesResponse>(url)
      const workspaces = datas.workspaces;
      let dirPar = flags.output ? flags.output : 'download'
      let dir = ''
      let actionId: string[] = []

      // get all datastore in workspace
      for(let workspace of workspaces){
        url = `/api/v0/workspaces/${workspace.workspace_id}/applications`;
        const {data: dtDatastores} = await this.hexaapi.get<GetDatastoresInWorkSpaceResponse[]>(url)
        try {
          for(const dtDatastore of dtDatastores) {
            const applicationId = dtDatastore.application_id;
            const appDisplayId = dtDatastore.display_id.replace(' ', '_');
            const datastoresArr = dtDatastore.datastores;

            // get all item in datastore
            if(datastoresArr) {
              for(let datastoreItem of datastoresArr) {
                const datastoreId = datastoreItem.datastore_id;
                const dDisplayId = datastoreItem.display_id.replace(' ', '_');
                url = `/api/v0/applications/${applicationId}/datastores/${datastoreId}/items/search`
                const {data: dtItems} = await this.hexaapi.post<any>(
                url, {
                  "page":1,
                  "per_page":0,
                });

                // download each script in 
                try {
                  const {items} = dtItems;
                  for(let item of items){
                    const itemId = item.i_id;
                    url = `/api/v0/applications/${applicationId}/datastores/${datastoreId}/items/details/${itemId}`
                    const {data: actions} = await this.hexaapi.get<ItemDetailResponse>(url)
                    try {
                      if(actions.item_actions){
                        for(let action of actions.item_actions){
                            if(action && !actionId.includes(action.action_id)) {
                              actionId.push(action.action_id)
                              for (const type of types) {
                                dir = `./${dirPar}/${appDisplayId}/${dDisplayId}`
                                cli.action.start(`downloading ${type}-script with action_id ${chalk.cyan(action.action_id)}`)
                                const url = `${this.context.server}/api/v0/actions/${action.action_id}/actionscripts/download?script_type=${type}`
                                try {
                                  await this.downloadScript(url, dir, action.action_id, type)
                                  console.log(`Download success ${action.action_id}`)
                                } catch(e) {
                                  console.log(`Error download with action:${action.action_id}-${type}`)
                                }
                              }
                            }
                          }
                        }
                    } catch (error) {
                      console.log(`Error get actions in app: ${applicationId} datastores: ${datastoreId} items: ${itemId}`)
                    }
                  }
                } catch (error) {
                  console.log(`Error get item in app: ${applicationId} datastores: ${datastoreId}`)
                }
              }
            }
          }
        } catch (error) {
          console.log(`Error get datastore in app: ${workspace.workspace_id}`)
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
  
  async downloadScript(url: string, dir: string, actionId: string, type: string){
    const token = this.hexaconfig.get(`hexabase.${this.currentContext}.token`)
    const downloadOptions = {
      mode: '666',
      filename: `${actionId}-${type}.js`,
      headers: {
        accept: 'application/javascript',
        authorization: `Bearer ${token}`,
      },
    }
    await download(url, dir, downloadOptions)
  }
}