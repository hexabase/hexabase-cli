"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const enquirer_1 = require("enquirer");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const base_with_context_1 = tslib_1.__importDefault(require("../../base-with-context"));
class WorkspacesUse extends base_with_context_1.default {
    constructor() {
        super(...arguments);
        this.questions = [
            {
                type: 'select',
                name: 'workspace',
                message: 'Select your workspace',
                choices: [],
            },
        ];
    }
    async run() {
        const { args } = this.parse(WorkspacesUse);
        let url = '/api/v0/workspaces';
        const { data: workspaceResponse } = await this.hexaAPI.get(url);
        if (!args.workspace_id) {
            this.questions[0].choices = workspaceResponse.workspaces.map(ws => {
                return {
                    name: ws.workspace_id,
                    message: ws.workspace_name,
                    hint: ws.workspace_id,
                };
            });
            const { workspace: workspace_id } = await (0, enquirer_1.prompt)(this.questions[0]);
            args.workspace_id = workspace_id;
        }
        url = `/api/v0/workspaces/${args.workspace_id}/select`;
        await this.hexaAPI.post(url);
        const currentWorkspace = workspaceResponse.workspaces.find((ws) => {
            return ws.workspace_id === args.workspace_id;
        });
        this.log(`Current-workspace set to: ${currentWorkspace ?
            chalk_1.default.cyan(currentWorkspace.workspace_name) :
            chalk_1.default.red('could not be determined')}`);
    }
}
exports.default = WorkspacesUse;
WorkspacesUse.description = 'set current workspace in hexabase';
WorkspacesUse.aliases = ['select', 'sel'];
WorkspacesUse.flags = Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }) });
WorkspacesUse.args = [
    {
        name: 'workspace_id',
        description: 'workspace_id from hexabase',
    },
];
