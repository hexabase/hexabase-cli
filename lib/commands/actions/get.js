"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const enquirer_1 = require("enquirer");
const cli_ux_1 = require("cli-ux");
const base_with_context_1 = tslib_1.__importDefault(require("../../base-with-context"));
class ActionsGet extends base_with_context_1.default {
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
            {
                type: 'select',
                name: 'status',
                message: 'Select a status for the action',
                choices: [],
            },
        ];
    }
    async run() {
        const { args, flags } = this.parse(ActionsGet);
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
            url = `/api/v0/datastores/${args.datastore_id}/statuses`;
            const { data: statuses } = await this.hexaAPI.get(url);
            this.questions[2].choices = statuses.map(st => {
                return {
                    name: st.status_id,
                    message: st.displayed_name,
                    hint: st.status_id,
                };
            });
            const { status: status_id } = await (0, enquirer_1.prompt)(this.questions[2]);
            args.status_id = status_id;
        }
        let url = `/api/v0/datastores/${args.datastore_id}/actions`;
        if (args.status_id) {
            url = `${url}?status_id=${args.status_id}`;
        }
        const { data: actions } = await this.hexaAPI.get(url);
        const columns = {
            action_id: {
                header: 'ID',
            },
            display_id: {
                header: 'DISPLAY_ID',
            },
            name: {
                header: 'NAME',
            },
            operation: {
                header: 'OPERATION',
            },
            is_status_action: {
                header: 'IS_STATUS_ACTION',
                extended: !args.status_id,
            },
            set_status: {
                header: 'NEXT_STATUS_ID',
                extended: false,
                get: (row) => {
                    return row.set_status ? row.set_status : '';
                },
            },
            status_id: {
                header: 'STATUS_ID',
                extended: true,
                get: (row) => {
                    return row.status_id ? row.status_id : '';
                },
            },
        };
        cli_ux_1.cli.table(actions, columns, Object.assign({ printLine: this.log }, flags));
    }
}
exports.default = ActionsGet;
ActionsGet.description = 'get actions in a datastore';
ActionsGet.aliases = ['ac'];
ActionsGet.flags = Object.assign(Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }) }), cli_ux_1.cli.table.flags());
ActionsGet.args = [
    {
        name: 'datastore_id',
        description: 'datastore_id from hexabase',
        required: false,
    },
    {
        name: 'status_id',
        description: 'status_id of the status action',
    },
];
