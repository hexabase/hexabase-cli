"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const conf_1 = tslib_1.__importDefault(require("conf"));
class ContextsSet extends command_1.Command {
    constructor() {
        super(...arguments);
        this.hexaConfig = new conf_1.default();
    }
    async run() {
        const { args, flags } = this.parse(ContextsSet);
        if (Object.keys(flags).length === 0 && typeof flags === 'object') {
            throw new Error('At least one flag needed');
        }
        Object.entries(flags).forEach(entry => {
            this.hexaConfig.set(`contexts.${args.context}.${entry[0]}`, entry[1]);
        });
        if (!this.hexaConfig.get('current-context')) {
            this.hexaConfig.set('current-context', args.context);
            this.log(`Current-context set to: ${chalk_1.default.cyan(args.context)}`);
        }
    }
}
exports.default = ContextsSet;
ContextsSet.description = 'set context entries (server & sse)';
ContextsSet.flags = {
    help: command_1.flags.help({ char: 'h' }),
    server: command_1.flags.string({ description: 'API server, e.g. https://api.hexabase.com' }),
    sse: command_1.flags.string({ description: 'SSE server, e.g. https://sse.hexabase.com' }),
};
ContextsSet.args = [
    {
        name: 'context',
        description: 'context name',
        required: true,
    },
];
