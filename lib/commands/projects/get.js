"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const cli_ux_1 = require("cli-ux");
const base_with_context_1 = tslib_1.__importDefault(require("../../base-with-context"));
class ProjectsGet extends base_with_context_1.default {
    async run() {
        const { flags } = this.parse(ProjectsGet);
        let url = '/api/v0/workspacecurrent';
        const { data: currentWorkspace } = await this.hexaAPI.get(url);
        url = `/api/v0/workspaces/${currentWorkspace.workspace_id}/applications`;
        const { data: projects } = await this.hexaAPI.get(url);
        const columns = {
            application_id: {
                header: 'ID',
            },
            display_id: {
                header: 'DISPLAY_ID',
            },
            name: {
                header: 'NAME',
            },
        };
        cli_ux_1.cli.table(projects, columns, Object.assign({ printLine: this.log }, flags));
    }
}
exports.default = ProjectsGet;
ProjectsGet.description = 'get projects in current workspace';
ProjectsGet.aliases = ['pj', 'projects'];
ProjectsGet.flags = Object.assign(Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }) }), cli_ux_1.cli.table.flags());
