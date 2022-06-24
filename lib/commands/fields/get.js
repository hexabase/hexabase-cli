"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const enquirer_1 = require("enquirer");
const cli_ux_1 = require("cli-ux");
const base_with_context_1 = tslib_1.__importDefault(require("../../base-with-context"));
class FieldsGet extends base_with_context_1.default {
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
        const { args, flags } = this.parse(FieldsGet);
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
        const url = `/api/v0/datastores/${args.datastore_id}/fields`;
        const { data: fieldsResponse } = await this.hexaAPI.get(url);
        let fields = [];
        if (fieldsResponse.fields) {
            // fieldsResponse is returned as an object -> convert to sorted array
            fields = Object.keys(fieldsResponse.fields)
                .map(key => fieldsResponse.fields[key])
                .sort((x, y) => x.fieldIndex - y.fieldIndex);
        }
        const columns = {
            field_id: {
                header: 'ID',
            },
            display_id: {
                header: 'DISPLAY_ID',
            },
            name: {
                header: 'NAME',
            },
            dataType: {
                header: 'DATA_TYPE',
            },
        };
        cli_ux_1.cli.table(fields, columns, Object.assign({ printLine: this.log }, flags));
    }
}
exports.default = FieldsGet;
FieldsGet.description = 'get fields in a datastore';
FieldsGet.aliases = ['fd', 'fields'];
FieldsGet.flags = Object.assign(Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }) }), cli_ux_1.cli.table.flags());
FieldsGet.args = [
    {
        name: 'datastore_id',
        description: 'datastore_id from hexabase',
        required: false,
    },
];
