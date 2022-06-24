"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const enquirer_1 = require("enquirer");
const cli_ux_1 = tslib_1.__importDefault(require("cli-ux"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const download_1 = tslib_1.__importDefault(require("download"));
const base_with_context_1 = tslib_1.__importDefault(require("../../../base-with-context"));
class ActionsScriptDownload extends base_with_context_1.default {
    constructor() {
        super(...arguments);
        this.questions = [
            {
                type: 'input',
                name: 'output',
                message: `Specify the ${chalk_1.default.cyan('output')} of the actionscript file`,
                initial: '',
                validate: function (input) {
                    if (input.length === 0) {
                        return 'Cannot be empty';
                    }
                    return input.length !== 0;
                },
            },
        ];
    }
    async run() {
        const { args, flags } = this.parse(ActionsScriptDownload);
        const noOutputFlag = typeof flags.output === 'undefined';
        try {
            // specify filename
            if (noOutputFlag) {
                this.questions[0].initial = `${flags.type}-${args.action_id}.js`;
                flags.output = await (0, enquirer_1.prompt)(this.questions[0]).then(({ output }) => output);
            }
            // download from apicore
            cli_ux_1.default.action.start(`Downloading ${flags.type}-script with action_id ${chalk_1.default.cyan(args.action_id)}`);
            const url = `${this.context.server}/api/v0/actions/${args.action_id}/actionscripts/download?script_type=${flags.type}`;
            const token = this.hexaConfig.get(`hexabase.${this.currentContext}.token`);
            const downloadOptions = {
                mode: '666',
                filename: flags.output,
                headers: {
                    accept: 'application/javascript',
                    authorization: `Bearer ${token}`,
                },
            };
            await (0, download_1.default)(url, './', downloadOptions);
            cli_ux_1.default.action.stop();
        }
        finally {
            if (noOutputFlag) {
                this.log("You can specify the output file with the '--output' flag in the future");
            }
        }
    }
}
exports.default = ActionsScriptDownload;
ActionsScriptDownload.description = 'download actionscript file';
ActionsScriptDownload.aliases = ['scripts:download', 'as:get', 'as'];
ActionsScriptDownload.flags = Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }), type: command_1.flags.string({
        char: 't',
        description: 'script type',
        options: ['post', 'pre'],
        required: true,
    }), output: command_1.flags.string({ char: 'o', description: 'output file' }) });
ActionsScriptDownload.args = [
    {
        name: 'action_id',
        description: 'action_id from hexabase',
        required: true,
    },
];
