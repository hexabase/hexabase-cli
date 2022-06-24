"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const enquirer_1 = require("enquirer");
const cli_ux_1 = tslib_1.__importDefault(require("cli-ux"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const base_with_context_1 = tslib_1.__importDefault(require("../../../base-with-context"));
const fs = require("fs");
var rimraf = require("rimraf");
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
            return { name: newnamefile, key: 'n' };
        }
    }
    // get name file setting all
    async nameFileAll(outDir, displayApp) {
        if (!fs.existsSync(`${outDir}/${displayApp}`)) {
            return `${outDir}/${displayApp}`;
        }
        else {
            const { name, key } = await this.getName(displayApp);
            if (key == 'y') {
                rimraf.sync(`${outDir}/${displayApp}`);
            }
            return `${outDir}/${name}`;
        }
    }
    // save data setting to file
    async saveSetting(path, nameFile, dataSave) {
        if (!fs.existsSync(`${path}/${nameFile}.json`)) {
            await this.saveFile(path, nameFile, dataSave);
        }
        else {
            const data = await this.getName(nameFile);
            if (data === null || data === void 0 ? void 0 : data.name) {
                await this.saveFile(path, data.name, dataSave);
            }
            ;
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
        const { flags } = this.parse(DownloadSettings);
        const noOutputFolder = typeof flags.output === 'undefined';
        try {
            if (noOutputFolder) {
                this.questions[0].initial = 'settings';
                flags.output = await (0, enquirer_1.prompt)(this.questions[0]).then(({ output }) => output);
            }
            const outDir = `hexabase/${flags.output}`;
            let url = '/api/v0/workspacecurrent';
            const { data: currentWorkspace } = await this.hexaAPI.get(url);
            url = `/api/v0/workspaces/${currentWorkspace.workspace_id}/applications`;
            const { data: projects } = await this.hexaAPI.get(url);
            this.questions[3].choices = projects.map(pj => {
                return {
                    name: pj.application_id,
                    message: pj.name,
                    hint: pj.application_id,
                };
            });
            const { project: project_id } = await (0, enquirer_1.prompt)(this.questions[3]);
            /** download application setting */
            url = `/api/v0/applications/${project_id}/setting`;
            const { data: projectSetting } = await this.hexaAPI.get(url);
            const displayApp = projectSetting.display_id ? projectSetting.display_id : project_id;
            const nameFolder = await this.nameFileAll(outDir, displayApp);
            await this.saveFile(nameFolder, "app-settings", projectSetting);
            /** datastores */
            url = `/api/v0/applications/${project_id}/datastores`;
            const { data: datastores } = await this.hexaAPI.get(url);
            for (const ds of datastores) {
                /** datastore setting */
                url = `/api/v0/datastores/${ds.datastore_id}/setting`;
                const { displayApp, displayDatastore } = await this.getAppAndDatastore(ds.datastore_id);
                const { data: datastoreSetting } = await this.hexaAPI.get(url);
                await this.saveFile(`${nameFolder}/${displayDatastore}`, "datastore-settings", datastoreSetting);
                /** action setting*/
                url = `/api/v0/datastores/${ds.datastore_id}/action/setting`;
                const { data: actionSetting } = await this.hexaAPI.get(url);
                await this.saveFile(`${nameFolder}/${displayDatastore}`, "action-settings", actionSetting);
            }
            ;
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
DownloadSettings.description = 'download all settings of the project in the current workspace';
DownloadSettings.aliases = ['pj:settings:getall'];
DownloadSettings.flags = Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }), output: command_1.flags.string({ char: 'o', description: 'output folder' }) });
