"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const enquirer_1 = require("enquirer");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const base_with_context_1 = tslib_1.__importDefault(require("../../base-with-context"));
class FieldsUpdate extends base_with_context_1.default {
    constructor() {
        super(...arguments);
        this.questions = [
            {
                type: 'list',
                name: 'roles',
                message: 'Add comma-separated role_ids (must include admin role)',
                initial: '',
                validate: function (roles) {
                    if (roles.length === 0) {
                        return 'At least one item needed';
                    }
                    if (Array.isArray(roles) && roles.some(role => role.trim() === '')) {
                        return 'Empty role_id';
                    }
                    return roles.length > 0;
                },
            },
            {
                type: 'form',
                name: 'fieldForm',
                message: 'Please provide the display_id and name for your field',
                choices: [
                    {
                        name: 'display_id',
                        message: 'Display_ID',
                        initial: '',
                        validate(value) {
                            return value.length > 0;
                        },
                    },
                    {
                        name: 'en',
                        message: 'Field Name (en)',
                        initial: '',
                        validate(value) {
                            return value.length > 0;
                        },
                    },
                    {
                        name: 'ja',
                        message: 'Field Name (ja)',
                        initial: '',
                        validate(value) {
                            return value.length > 0;
                        },
                    },
                ],
                validate(value) {
                    return (value.en.length > 0 && value.ja.length > 0) ? true : 'Cannot be empty';
                },
            },
        ];
    }
    async run() {
        const { args } = this.parse(FieldsUpdate);
        const url = `/api/v0/datastores/${args.datastore_id}/fields/${args.field_id}`;
        const { data: fieldSettings } = await this.hexaAPI.get(url);
        this.questions[0].initial = fieldSettings.roles.filter(role => role.can_use).map(role => role.role_id).join(', ');
        const { roles } = await (0, enquirer_1.prompt)(this.questions[0]);
        this.questions[1].choices[0].initial = fieldSettings.display_id;
        this.questions[1].choices[1].initial = fieldSettings.name.en;
        this.questions[1].choices[2].initial = fieldSettings.name.ja;
        const { fieldForm } = await (0, enquirer_1.prompt)(this.questions[1]);
        this.log(`Display_ID: ${chalk_1.default.cyan(fieldForm.display_id)}`);
        this.log(`Field Name (en): ${chalk_1.default.cyan(fieldForm.en)}`);
        this.log(`Field Name (ja): ${chalk_1.default.cyan(fieldForm.ja)}`);
        const data = {
            display_id: fieldForm.display_id,
            name: { en: fieldForm.en, ja: fieldForm.ja },
            roles: roles,
        };
        await this.hexaAPI.patch(url, data);
        this.log('Field successfully updated');
    }
}
exports.default = FieldsUpdate;
FieldsUpdate.description = 'update a field in a datastore';
FieldsUpdate.flags = Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }) });
FieldsUpdate.args = [
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
