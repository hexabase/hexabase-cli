"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const cli_ux_1 = require("cli-ux");
const base_with_context_1 = tslib_1.__importDefault(require("../../../base-with-context"));
class ProjectsRolesGet extends base_with_context_1.default {
    async run() {
        const { args, flags } = this.parse(ProjectsRolesGet);
        const url = `/api/v0/applications/${args.project_id}/roles`;
        const { data: roles } = await this.hexaAPI.get(url);
        const columns = {
            role_id: {
                header: 'ID',
            },
            display_id: {
                header: 'DISPLAY_ID',
            },
            name: {
                header: 'NAME',
            },
            type: {
                header: 'TYPE',
            },
        };
        cli_ux_1.cli.table(roles, columns, Object.assign({ printLine: this.log }, flags));
    }
}
exports.default = ProjectsRolesGet;
ProjectsRolesGet.description = 'get roles of a project';
ProjectsRolesGet.flags = Object.assign(Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }) }), cli_ux_1.cli.table.flags());
ProjectsRolesGet.args = [
    {
        name: 'project_id',
        description: 'project_id from hexabase',
        required: true,
    },
];
