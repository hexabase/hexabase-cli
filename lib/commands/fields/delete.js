"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const enquirer_1 = require("enquirer");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const base_with_context_1 = tslib_1.__importDefault(require("../../base-with-context"));
class FieldsDelete extends base_with_context_1.default {
    constructor() {
        super(...arguments);
        this.questions = [
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Do you want to proceed?',
            },
        ];
    }
    async run() {
        const { args, flags } = this.parse(FieldsDelete);
        let shouldProceed = false;
        if (flags.yes) {
            shouldProceed = true;
        }
        else {
            this.log(`You are about to delete the field with id: ${chalk_1.default.cyan(args.field_id)}`);
            shouldProceed = await (0, enquirer_1.prompt)(this.questions[0]).then(({ confirm }) => confirm);
        }
        if (shouldProceed) {
            const url = `/api/v0/datastores/${args.datastore_id}/fields/${args.field_id}`;
            await this.hexaAPI.delete(url);
            this.log('Field successfully deleted');
        }
        else {
            this.log(chalk_1.default.red('Deletion  aborted'));
        }
    }
}
exports.default = FieldsDelete;
FieldsDelete.description = 'delete a field in a datastore';
FieldsDelete.flags = Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }), yes: command_1.flags.boolean({ char: 'y', description: 'skip confirmation' }) });
FieldsDelete.args = [
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
