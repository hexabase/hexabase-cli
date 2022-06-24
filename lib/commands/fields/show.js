"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const base_with_context_1 = tslib_1.__importDefault(require("../../base-with-context"));
class FieldsShow extends base_with_context_1.default {
    async run() {
        const { args } = this.parse(FieldsShow);
        const url = `/api/v0/datastores/${args.datastore_id}/fields/${args.field_id}`;
        const { data: fieldSettings } = await this.hexaAPI.get(url);
        this.log(JSON.stringify(fieldSettings, undefined, 2));
    }
}
exports.default = FieldsShow;
FieldsShow.description = 'show details of a field';
FieldsShow.flags = Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }) });
FieldsShow.args = [
    {
        name: 'datastore_id',
        description: 'datastore_id from hexabase',
        required: true,
    },
    {
        name: 'field_id',
        description: 'field_id from hexabase',
        required: true,
    },
];
