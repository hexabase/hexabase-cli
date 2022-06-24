"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const enquirer_1 = require("enquirer");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const base_with_context_1 = tslib_1.__importDefault(require("../../base-with-context"));
class ActionsUpdate extends base_with_context_1.default {
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
                name: 'actionForm',
                message: 'Please provide the display_id and name for your action',
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
                        message: 'Action Name (en)',
                        initial: '',
                        validate(value) {
                            return value.length > 0;
                        },
                    },
                    {
                        name: 'ja',
                        message: 'Action Name (ja)',
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
        const { args } = this.parse(ActionsUpdate);
        const url = `/api/v0/datastores/${args.datastore_id}/actions/${args.action_id}`;
        const { data: actionSettings } = await this.hexaAPI.get(url);
        this.questions[0].initial = actionSettings.roles.filter(role => role.can_execute).map(role => role.role_id).join(', ');
        const { roles } = await (0, enquirer_1.prompt)(this.questions[0]);
        this.questions[1].choices[0].initial = actionSettings.display_id;
        this.questions[1].choices[1].initial = actionSettings.name.en;
        this.questions[1].choices[2].initial = actionSettings.name.ja;
        const { actionForm } = await (0, enquirer_1.prompt)(this.questions[1]);
        this.log(`Display_ID: ${chalk_1.default.cyan(actionForm.display_id)}`);
        this.log(`Action Name (en): ${chalk_1.default.cyan(actionForm.en)}`);
        this.log(`Action Name (ja): ${chalk_1.default.cyan(actionForm.ja)}`);
        const data = {
            display_id: actionForm.display_id,
            name: { en: actionForm.en, ja: actionForm.ja },
            roles: roles,
        };
        await this.hexaAPI.patch(url, data);
        this.log('Action successfully updated');
    }
}
exports.default = ActionsUpdate;
ActionsUpdate.description = 'update an action in a datastore';
ActionsUpdate.flags = Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }) });
ActionsUpdate.args = [
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
