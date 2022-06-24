"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const enquirer_1 = require("enquirer");
const cli_ux_1 = tslib_1.__importDefault(require("cli-ux"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const download_1 = tslib_1.__importDefault(require("download"));
const base_with_context_1 = tslib_1.__importDefault(require("../../../base-with-context"));
class ActionsScriptDownloadsAll extends base_with_context_1.default {
    constructor() {
        super(...arguments);
        this.questions = [
            {
                type: 'input',
                name: 'output',
                message: `Specify the ${chalk_1.default.cyan('output')} of the actionscript file`,
                initial: 'download',
                validate: function (input) {
                    if (input.length === 0) {
                        return 'Cannot be empty';
                    }
                    return input.length !== 0;
                },
            },
            {
                type: 'select',
                name: 'project',
                message: 'Select your project',
                choices: [],
            },
        ];
    }
    async run() {
        const types = ['post', 'pre'];
        const { args, flags } = this.parse(ActionsScriptDownloadsAll);
        const noOutputFolder = typeof flags.output === 'undefined';
        const token = this.hexaConfig.get(`hexabase.${this.currentContext}.token`);
        try {
            //get all application
            let url = '/api/v0/workspacecurrent';
            const { data: currentWorkspace } = await this.hexaAPI.get(url);
            url = `/api/v0/workspaces/${currentWorkspace.workspace_id}/applications`;
            const { data: projects } = await this.hexaAPI.get(url);
            this.questions[1].choices = projects.map(pj => {
                return {
                    name: pj.application_id,
                    message: pj.name,
                    hint: pj.application_id,
                };
            });
            //get folder input and args
            if (noOutputFolder) {
                this.questions[0].initial = `download`;
                flags.output = await (0, enquirer_1.prompt)(this.questions[0]).then(({ output }) => output);
            }
            if (!args.project_id) {
                const { project: project_id } = await (0, enquirer_1.prompt)(this.questions[1]);
                args.project_id = project_id;
            }
            const disApp = await this.getDisplayApp(args.project_id, this.questions[1].choices);
            let dirPath = flags.output ? flags.output : 'download';
            // start process get download: get datastore->action
            let urlDl = `/api/v0/applications/${args.project_id}/datastores`;
            const { data: datastores } = await this.hexaAPI.get(urlDl);
            for (let datastore of datastores) {
                const disDs = datastore.display_id ? datastore.display_id : datastore.datastore_id;
                urlDl = `/api/v0/datastores/${datastore.datastore_id}/actions`;
                const { data: actions } = await this.hexaAPI.get(urlDl);
                for (let action of actions) {
                    const disAc = action.display_id ? action.display_id : action.action_id;
                    let dir = `./${dirPath}/${disApp}/${disDs}`;
                    // download with type [post or pre]
                    for (const type of types) {
                        urlDl = `${this.context.server}/api/v0/actions/${action.action_id}/actionscripts/download?script_type=${type}`;
                        try {
                            await this.downloadScript(urlDl, dir, `${disAc}-${type}`);
                            console.log(`Download success ${disAc}`);
                        }
                        catch (e) {
                        }
                    }
                }
            }
            cli_ux_1.default.action.stop();
        }
        catch (e) {
            throw e;
        }
        finally {
            if (noOutputFolder)
                this.log("You can specify the output folder with the '--output' flag in the future");
        }
    }
    // function get display id of application
    async getDisplayApp(checkValue, arrayCheck) {
        const data = arrayCheck.find((app) => {
            return app.name == checkValue;
        });
        return data.message ? data.message : checkValue;
    }
    // function download actionscript
    async downloadScript(url, dir, filename) {
        const token = this.hexaConfig.get(`hexabase.${this.currentContext}.token`);
        const downloadOptions = {
            mode: '666',
            filename: `${filename}.js`,
            headers: {
                accept: 'application/javascript',
                authorization: `Bearer ${token}`,
            },
        };
        await (0, download_1.default)(url, dir, downloadOptions);
    }
}
exports.default = ActionsScriptDownloadsAll;
ActionsScriptDownloadsAll.description = 'download all actionscript file';
ActionsScriptDownloadsAll.aliases = ['scripts:download-all', 'as:getall', 'asall'];
ActionsScriptDownloadsAll.flags = Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }), output: command_1.flags.string({ char: 'o', description: 'output folder' }) });
ActionsScriptDownloadsAll.args = [
    {
        name: 'project_id',
        description: 'Project_id from hexabase',
    },
];
