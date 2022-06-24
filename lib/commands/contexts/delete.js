"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const enquirer_1 = require("enquirer");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const conf_1 = tslib_1.__importDefault(require("conf"));
class ContextsDelete extends command_1.Command {
    constructor() {
        super(...arguments);
        this.questions = [
            {
                type: 'select',
                name: 'context',
                message: 'Select the context to delete',
                choices: [],
            },
        ];
        this.hexaConfig = new conf_1.default();
    }
    async run() {
        const { args } = this.parse(ContextsDelete);
        const contexts = this.hexaConfig.get('contexts');
        if (!contexts) {
            return this.log('No context found');
        }
        if (!args.context) {
            this.questions[0].choices = Object.keys(contexts);
            const { context } = await (0, enquirer_1.prompt)(this.questions[0]);
            args.context = context;
        }
        if (!Object.keys(contexts).includes(args.context)) {
            throw new Error('No such context');
        }
        this.hexaConfig.delete(`contexts.${args.context}`);
        this.log(`Context deleted successfully: ${chalk_1.default.cyan(args.context)}`);
    }
}
exports.default = ContextsDelete;
ContextsDelete.description = 'delete context entries';
ContextsDelete.flags = {
    help: command_1.flags.help({ char: 'h' }),
};
ContextsDelete.args = [
    {
        name: 'context',
        description: 'context name',
    },
];
