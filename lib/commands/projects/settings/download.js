"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const enquirer_1 = require("enquirer");
const cli_ux_1 = tslib_1.__importDefault(require("cli-ux"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const base_with_context_1 = tslib_1.__importDefault(require("../../../base-with-context"));
const fs = require("fs");
class DownloadSettings extends base_with_context_1.default {
    constructor() {
        super(...arguments);
        this.questions = [
            {
                type: 'input',
                name: 'output',
                message: `Specify the ${chalk_1.default.cyan('output')} of the setting file`,
                initial: 'settings',
                validate: function (input) {
                    if (input.length === 0) {
                        return 'Cannot be empty';
                    }
                    return input.length !== 0;
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
            {
                type: 'select',
                name: 'project',
                message: 'Select your project',
                choices: [],
            },
        ];
    }
    // save file
    async saveFile(path, nameFile, data) {
        fs.mkdirSync(path, { recursive: true });
        fs.writeFile(`${path}/${nameFile}.json`, JSON.stringify(data, null, 2), function (err) {
            if (err)
                throw err;
        });
        this.log(`completed save file: ${path}/${nameFile}.json`);
    }
    // get name and key press
    async getName(nameFile) {
        this.questions[1].message = `specified name file already in your folder "${nameFile}". overwrite? :  Y/n`;
        let keyPress = '';
        while (!['y', 'Y', 'n', 'N'].includes(keyPress)) {
            const { isoverride: isoverride } = await (0, enquirer_1.prompt)(this.questions[1]);
            keyPress = isoverride;
            this.log("Your key: ", keyPress);
        }
        if (keyPress === 'y' || keyPress === 'Y') {
            return { name: nameFile };
        }
        else {
            const { newnamefile: newnamefile } = await (0, enquirer_1.prompt)(this.questions[2]);
            return { name: newnamefile };
        }
    }
    // save data setting to file
    async saveSetting(path, nameFile, dataSave) {
        if (!fs.existsSync(`${path}/${nameFile}.json`)) {
            await this.saveFile(path, nameFile, dataSave);
        }
        else {
            const { name } = await this.getName(nameFile);
            if (name) {
                await this.saveFile(path, name, dataSave);
            }
        }
    }
    // get application and display_id applicaiton by datastore_id
    async getAppByDatastoreId(datastoreId) {
        let url = `/api/v0/applications/datastores/${datastoreId}`;
        const { data: projects } = await this.hexaAPI.get(url);
        try {
            const displayApp = projects.display_id ? projects.display_id : projects.p_id;
            return { displayApp, projects };
        }
        catch (e) {
            throw e;
        }
    }
    // get display_id of application and datastore by datastore_id
    async getAppAndDatastore(datastoreId) {
        let url = `/api/v0/applications/datastore/${datastoreId}`;
        const { data: data } = await this.hexaAPI.get(url);
        try {
            const displayApp = data.project.display_id ? data.project.display_id : data.project.p_id;
            const displayDatastore = data.datastore.display_id ? data.datastore.display_id : data.datastore.d_id;
            return { displayApp, displayDatastore };
        }
        catch (e) {
            throw e;
        }
    }
    async run() {
        const { args, flags } = this.parse(DownloadSettings);
        const noOutputFolder = typeof flags.output === 'undefined';
        if (Object.keys(flags).length === 0 && typeof flags === 'object') {
            throw new Error('At least one flag needed, (special -t)');
        }
        const typeDownload = flags.type;
        const { id } = args;
        try {
            if (noOutputFolder) {
                this.questions[0].initial = 'settings';
                flags.output = await (0, enquirer_1.prompt)(this.questions[0]).then(({ output }) => output);
            }
            const outDir = `hexabase/${flags.output}`;
            let url = '';
            switch (typeDownload) {
                case 'application':
                    this.log("downloading application setting...");
                    if (id) {
                        url = `/api/v0/applications/${id}/setting`;
                        const { data: projects } = await this.hexaAPI.get(url);
                        const displayApp = projects.display_id ? projects.display_id : projects.id;
                        if (!projects.workspace_id) {
                            throw new Error(`Error download application setting: hx projects:settings:download_all -t=application project_id`);
                        }
                        await this.saveSetting(`${outDir}/${displayApp}`, "app-settings", projects);
                    }
                    else {
                        throw new Error(`Need project_id: hx projects:settings:download_all -t=application project_id`);
                    }
                    break;
                case 'datastore':
                    this.log("downloading datastore setting...");
                    if (id) {
                        url = `/api/v0/datastores/${id}/setting`;
                        const { data: datastoreSetting } = await this.hexaAPI.get(url);
                        const { displayApp } = await this.getAppByDatastoreId(id);
                        const displayDatastore = datastoreSetting.display_id ? datastoreSetting.display_id : datastoreSetting.id;
                        if (!displayDatastore) {
                            throw new Error(`Error download datastores setting: hx projects:settings:download_all -t=datastores datastores_id`);
                        }
                        await this.saveSetting(`${outDir}/${displayApp}/${displayDatastore}`, "datastore-settings", datastoreSetting);
                    }
                    else {
                        throw new Error(`Need datastore_id: hx projects:settings:download_all -t=datastore datastore_id`);
                    }
                    break;
                case 'action':
                    this.log("downloading action setting...");
                    if (id) {
                        url = `/api/v0/datastores/${id}/action/setting`;
                        const { data: actionSetting } = await this.hexaAPI.get(url);
                        const { displayApp, displayDatastore } = await this.getAppAndDatastore(id);
                        if (!displayApp) {
                            throw new Error(`Error download action setting: hx projects:settings:download_all -t=action datastore_id`);
                        }
                        await this.saveSetting(`${outDir}/${displayApp}/${displayDatastore}`, "action-settings", actionSetting);
                    }
                    else {
                        throw new Error(`Need datastore_id: hx projects:settings:download_all -t=action datastore_id`);
                    }
                    break;
                default:
                    throw new Error(`with application setting need: -t=application project_id
          with datastore setting need: -t=datastore datastore_id.
          with action setting need: -t=action datastore_id`);
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
}
exports.default = DownloadSettings;
DownloadSettings.description = 'download settingdownload setting application, datastore, action with ID parameter';
DownloadSettings.aliases = ['pj:settings:get'];
DownloadSettings.flags = Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }), output: command_1.flags.string({ char: 'o', description: 'output folder' }), type: command_1.flags.string({
        char: 't',
        description: 'type download setting is one of the following options: [application, datastore, action] ',
        options: ['application', 'datastore', 'action'],
        required: true,
    }) });
DownloadSettings.args = [
    {
        name: 'id',
        description: 'project_id if -t=application and datastore_id if -t=datastore||action  from hexabase',
    },
];
