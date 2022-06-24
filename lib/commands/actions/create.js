"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const enquirer_1 = require("enquirer");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const base_with_context_1 = tslib_1.__importDefault(require("../../base-with-context"));
class ActionsCreate extends base_with_context_1.default {
    constructor() {
        super(...arguments);
        this.questions = [
            {
                type: 'select',
                name: 'operationType',
                message: 'Select operation type',
                choices: ['new', 'update', 'delete', 'copy'],
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
                name: 'actionName',
                message: 'Please provide the name for your action',
                choices: [
                    { name: 'en', message: 'Action Name (en)', validate(value) {
                            return value.length > 0;
                        } },
                    { name: 'ja', message: 'Action Name (ja)', validate(value) {
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
        const { args } = this.parse(ActionsCreate);
        const { operationType } = await (0, enquirer_1.prompt)(this.questions[0]);
        const { roles } = await (0, enquirer_1.prompt)(this.questions[1]);
        const { actionName } = await (0, enquirer_1.prompt)(this.questions[2]);
        this.log(`Project Name (en): ${chalk_1.default.cyan(actionName.en)}`);
        this.log(`Project Name (ja): ${chalk_1.default.cyan(actionName.ja)}`);
        const data = {
            operation: operationType,
            name: actionName,
            roles: roles,
        };
        const url = `/api/v0/datastores/${args.datastore_id}/actions`;
        const { data: action } = await this.hexaAPI.post(url, data);
        this.log(`Action successfully created:
action_id: ${chalk_1.default.cyan(action.action_id)}
display_id: ${chalk_1.default.cyan(action.display_id)}`);
    }
}
exports.default = ActionsCreate;
ActionsCreate.description = 'create an action in a datastore';
ActionsCreate.flags = Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }) });
ActionsCreate.args = [
    {
        name: 'datastore_id',
        description: 'datastore_id from hexabase',
        required: true,
    },
];
