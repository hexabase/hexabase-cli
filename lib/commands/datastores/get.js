"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const enquirer_1 = require("enquirer");
const cli_ux_1 = require("cli-ux");
const base_with_context_1 = tslib_1.__importDefault(require("../../base-with-context"));
class DatastoresGet extends base_with_context_1.default {
    constructor() {
        super(...arguments);
        this.questions = [
            {
                type: 'select',
                name: 'project',
                message: 'Select your project',
                choices: [],
            },
        ];
    }
    async run() {
        const { args, flags } = this.parse(DatastoresGet);
        if (!args.project_id) {
            let url = '/api/v0/workspacecurrent';
            const { data: currentWorkspace } = await this.hexaAPI.get(url);
            url = `/api/v0/workspaces/${currentWorkspace.workspace_id}/applications`;
            const { data: projects } = await this.hexaAPI.get(url);
            this.questions[0].choices = projects.map(pj => {
                return {
                    name: pj.application_id,
                    message: pj.name,
                    hint: pj.application_id,
                };
            });
            const { project: project_id } = await (0, enquirer_1.prompt)(this.questions[0]);
            args.project_id = project_id;
        }
        const url = `/api/v0/applications/${args.project_id}/datastores`;
        const { data: datastores } = await this.hexaAPI.get(url);
        const columns = {
            datastore_id: {
                header: 'ID',
            },
            display_id: {
                header: 'DISPLAY_ID',
            },
            name: {
                header: 'NAME',
            },
            deleted: {
                header: 'DELETED',
                extended: true,
            },
            imported: {
                header: 'IMPORTED',
                extended: true,
            },
            uploading: {
                header: 'UPLOADING',
                extended: true,
            },
        };
        cli_ux_1.cli.table(datastores, columns, Object.assign({ printLine: this.log }, flags));
    }
}
exports.default = DatastoresGet;
DatastoresGet.description = 'get datastores within a project';
DatastoresGet.aliases = ['ds', 'datastores'];
DatastoresGet.flags = Object.assign(Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }) }), cli_ux_1.cli.table.flags());
DatastoresGet.args = [
    {
        name: 'project_id',
        description: 'project_id from hexabase',
    },
];
