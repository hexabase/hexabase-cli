"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const enquirer_1 = require("enquirer");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const base_with_context_1 = tslib_1.__importDefault(require("../../base-with-context"));
const data_types_1 = require("../../api/models/data-types");
class FieldsCreate extends base_with_context_1.default {
    constructor() {
        super(...arguments);
        this.questions = [
            {
                type: 'select',
                name: 'dataType',
                message: 'Select a data type',
                choices: Object.keys(data_types_1.defaults).map(key => {
                    return {
                        message: data_types_1.defaults[key].name,
                        value: data_types_1.defaults[key].dataType,
                    };
                }),
            },
            {
                type: 'list',
                name: 'roles',
                message: 'Add comma-separated role_ids (must include admin role)',
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
                name: 'fieldName',
                message: 'Please provide the name for your field',
                choices: [
                    { name: 'en', message: 'Field Name (en)', validate(value) {
                            return value.length > 0;
                        } },
                    { name: 'ja', message: 'Field Name (ja)', validate(value) {
                            return value.length > 0;
                        } },
                ],
                validate(value) {
                    return (value.en.length > 0 && value.ja.length > 0) ? true : 'Cannot be empty';
                },
            },
        ];
    }
    async run() {
        const { args } = this.parse(FieldsCreate);
        const { dataType } = await (0, enquirer_1.prompt)(this.questions[0]);
        const { roles } = await (0, enquirer_1.prompt)(this.questions[1]);
        const { fieldName } = await (0, enquirer_1.prompt)(this.questions[2]);
        this.log(`Field Name (en): ${chalk_1.default.cyan(fieldName.en)}`);
        this.log(`Field Name (ja): ${chalk_1.default.cyan(fieldName.ja)}`);
        const data = {
            name: fieldName,
            dataType: data_types_1.defaults[dataType].dataType,
            as_title: data_types_1.defaults[dataType].asTitle,
            search: data_types_1.defaults[dataType].search,
            show_list: data_types_1.defaults[dataType].showList,
            full_text: data_types_1.defaults[dataType].fullText,
            unique: data_types_1.defaults[dataType].unique,
            roles: roles,
        };
        const url = `/api/v0/datastores/${args.datastore_id}/fields`;
        const { data: field } = await this.hexaAPI.post(url, data);
        this.log(`Field successfully created:
field_id: ${chalk_1.default.cyan(field.field_id)}
display_id: ${chalk_1.default.cyan(field.display_id)}`);
    }
}
exports.default = FieldsCreate;
FieldsCreate.description = 'create a field in a datastore';
FieldsCreate.flags = Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }) });
FieldsCreate.args = [
    {
        name: 'datastore_id',
        description: 'datastore_id from hexabase',
        required: true,
    },
];
