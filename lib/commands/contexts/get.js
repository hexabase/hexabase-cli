"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const cli_ux_1 = require("cli-ux");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const conf_1 = tslib_1.__importDefault(require("conf"));
class ContextsGet extends command_1.Command {
    constructor() {
        super(...arguments);
        this.hexaConfig = new conf_1.default();
    }
    async run() {
        const { flags } = this.parse(ContextsGet);
        const currentContext = this.hexaConfig.get('current-context');
        const contexts = this.hexaConfig.get('contexts');
        if (!contexts) {
            return this.log('No context found');
        }
        const contextsArray = Object.entries(contexts).map(item => {
            return {
                name: item[0],
                server: item[1].server,
                sse: item[1].sse,
            };
        });
        const columns = {
            name: {
                header: 'NAME',
            },
            server: {
                header: 'SERVER',
            },
            sse: {
                header: 'SSE',
            },
        };
        cli_ux_1.cli.table(contextsArray, columns, Object.assign({ printLine: this.log }, flags));
        if (!flags.output) {
            this.log(`Current-context set to: ${currentContext ?
                chalk_1.default.cyan(currentContext) :
                chalk_1.default.red(currentContext)}`);
        }
    }
}
exports.default = ContextsGet;
ContextsGet.description = 'get contexts';
ContextsGet.aliases = ['env'];
ContextsGet.flags = Object.assign({ help: command_1.flags.help({ char: 'h' }) }, cli_ux_1.cli.table.flags());
