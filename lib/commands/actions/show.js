"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const base_with_context_1 = tslib_1.__importDefault(require("../../base-with-context"));
class ActionsShow extends base_with_context_1.default {
    async run() {
        const { args } = this.parse(ActionsShow);
        const url = `/api/v0/datastores/${args.datastore_id}/actions/${args.action_id}`;
        const { data: actionSettings } = await this.hexaAPI.get(url);
        this.log(JSON.stringify(actionSettings, undefined, 2));
    }
}
exports.default = ActionsShow;
ActionsShow.description = 'show details of an action';
ActionsShow.flags = Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }) });
ActionsShow.args = [
    {
        name: 'datastore_id',
        description: 'datastore_id from hexabase',
        required: true,
    },
    {
        name: 'action_id',
        description: 'action_id from hexabase',
        required: true,
    },
];
