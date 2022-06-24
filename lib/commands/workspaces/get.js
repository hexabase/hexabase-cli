"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const cli_ux_1 = require("cli-ux");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const base_with_context_1 = tslib_1.__importDefault(require("../../base-with-context"));
class WorkspacesGet extends base_with_context_1.default {
    async run() {
        const { flags } = this.parse(WorkspacesGet);
        const url = '/api/v0/workspaces';
        const { data: workspaceResponse } = await this.hexaAPI.get(url);
        const currentWorkspace = workspaceResponse.workspaces.find((ws) => {
            return ws.workspace_id === workspaceResponse.current_workspace_id;
        });
        const columns = {
            workspace_id: {
                header: 'ID',
            },
            workspace_name: {
                header: 'NAME',
            },
        };
        cli_ux_1.cli.table(workspaceResponse.workspaces, columns, Object.assign({ printLine: this.log }, flags));
        if (!flags.output) {
            this.log(`Current-workspace set to: ${currentWorkspace ?
                chalk_1.default.cyan(currentWorkspace.workspace_name) :
                chalk_1.default.red('could not be determined')}`);
        }
    }
}
exports.default = WorkspacesGet;
WorkspacesGet.description = 'get workspaces from hexabase';
WorkspacesGet.aliases = ['ws', 'workspaces'];
WorkspacesGet.flags = Object.assign(Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }) }), cli_ux_1.cli.table.flags());
