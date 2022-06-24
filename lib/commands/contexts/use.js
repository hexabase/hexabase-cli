"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const enquirer_1 = require("enquirer");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const conf_1 = tslib_1.__importDefault(require("conf"));
class ContextsUse extends command_1.Command {
    constructor() {
        super(...arguments);
        this.questions = [
            {
                type: 'select',
                name: 'context',
                message: 'Select your current-context',
                choices: [],
            },
        ];
        this.hexaConfig = new conf_1.default();
    }
    async run() {
        const { args } = this.parse(ContextsUse);
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
        this.hexaConfig.set('current-context', args.context);
        this.log(`Current-context successfully set to: ${chalk_1.default.cyan(args.context)}`);
    }
}
exports.default = ContextsUse;
ContextsUse.description = 'set current-context';
ContextsUse.aliases = ['use'];
ContextsUse.flags = {
    help: command_1.flags.help({ char: 'h' }),
};
ContextsUse.args = [
    {
        name: 'context',
        description: 'context name',
    },
];
