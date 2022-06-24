"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const enquirer_1 = require("enquirer");
const cli_ux_1 = require("cli-ux");
const base_with_context_1 = tslib_1.__importDefault(require("../../base-with-context"));
class StatusesGet extends base_with_context_1.default {
    constructor() {
        super(...arguments);
        this.questions = [
            {
                type: 'select',
                name: 'project',
                message: 'Select your project',
                choices: [],
            },
            {
                type: 'select',
                name: 'datastore',
                message: 'Select a datastore',
                choices: [],
            },
        ];
    }
    async run() {
        const { args, flags } = this.parse(StatusesGet);
        if (!args.datastore_id) {
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
            url = `/api/v0/applications/${project_id}/datastores`;
            const { data: datastores } = await this.hexaAPI.get(url);
            this.questions[1].choices = datastores.map(ds => {
                return {
                    name: ds.datastore_id,
                    message: ds.name,
                    hint: ds.datastore_id,
                };
            });
            const { datastore: datastore_id } = await (0, enquirer_1.prompt)(this.questions[1]);
            args.datastore_id = datastore_id;
        }
        const url = `/api/v0/datastores/${args.datastore_id}/statuses`;
        const { data: statuses } = await this.hexaAPI.get(url);
        const columns = {
            status_id: {
                header: 'ID',
            },
            display_id: {
                header: 'DISPLAY_ID',
            },
            name: {
                header: 'NAME',
                get: (row) => row.displayed_name,
            },
            sort_id: {
                header: 'SORT_ID',
                extended: true,
            },
            x: {
                header: 'X',
                extended: true,
            },
            y: {
                header: 'Y',
                extended: true,
            },
        };
        cli_ux_1.cli.table(statuses, columns, Object.assign({ printLine: this.log }, flags));
    }
}
exports.default = StatusesGet;
StatusesGet.description = 'get statuses in a datastore';
StatusesGet.aliases = ['st', 'status'];
StatusesGet.flags = Object.assign(Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }) }), cli_ux_1.cli.table.flags());
StatusesGet.args = [
    {
        name: 'datastore_id',
        description: 'datastore_id from hexabase',
        required: false,
    },
];
