"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const base_with_context_1 = tslib_1.__importDefault(require("../../base-with-context"));
class LogsActionscript extends base_with_context_1.default {
    async run() {
        const { args } = this.parse(LogsActionscript);
        const { channel } = args;
        this.hexaSSE.connect(`/sse?channel=${channel}`);
        if (!this.hexaSSE.source) {
            throw new Error('Could not establish connection');
        }
        this.log(`Listening for logs on ${chalk_1.default.cyan(this.hexaSSE.baseUrl)}...`);
        this.hexaSSE.source.addEventListener('log_actionscript', (event) => {
            this.log(JSON.parse(event.data).message);
        });
        this.hexaSSE.source.addEventListener('error', (error) => {
            throw error;
        });
    }
}
exports.default = LogsActionscript;
LogsActionscript.description = 'get logs from actionscript';
LogsActionscript.flags = Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }) });
LogsActionscript.args = [
    {
        name: 'channel',
        description: `input format: ${chalk_1.default.cyan('logs_<user_id>_<project_id>')}`,
        required: true,
    },
];
