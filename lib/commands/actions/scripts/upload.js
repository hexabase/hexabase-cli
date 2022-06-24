"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const enquirer_1 = require("enquirer");
const cli_ux_1 = tslib_1.__importDefault(require("cli-ux"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const form_data_1 = tslib_1.__importDefault(require("form-data"));
const base_with_context_1 = tslib_1.__importDefault(require("../../../base-with-context"));
class ActionsScriptsUpload extends base_with_context_1.default {
    constructor() {
        super(...arguments);
        this.questions = [
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Do you want to proceed?',
            },
        ];
    }
    async run() {
        const { args, flags } = this.parse(ActionsScriptsUpload);
        let shouldProceed = false;
        if (flags.yes) {
            shouldProceed = true;
        }
        else {
            this.log(`You are about to upload the script file to:
  action_id: ${chalk_1.default.cyan(args.action_id)}
  script_type: ${chalk_1.default.cyan(flags.type)}
  context: ${chalk_1.default.cyan(this.currentContext)}`);
            shouldProceed = await (0, enquirer_1.prompt)(this.questions[0]).then(({ confirm }) => confirm);
        }
        if (shouldProceed) {
            cli_ux_1.default.action.start(`Uploading ${flags.type}-script from file ${chalk_1.default.cyan(args.file)}`);
            const url = `/api/v0/actions/${args.action_id}/actionscripts/upload`;
            const form = new form_data_1.default();
            form.append('file', fs_1.default.createReadStream(args.file));
            form.append('script_type', flags.type);
            const token = this.hexaConfig.get(`hexabase.${this.currentContext}.token`);
            const requestConfig = {
                headers: Object.assign({ authorization: `Bearer ${token}` }, form.getHeaders()),
            };
            await this.hexaAPI.post(url, form, requestConfig);
            cli_ux_1.default.action.stop();
        }
        else {
            this.log(chalk_1.default.red('Uploading aborted'));
        }
    }
}
exports.default = ActionsScriptsUpload;
ActionsScriptsUpload.description = 'upload actionscript file';
ActionsScriptsUpload.aliases = ['scripts:upload', 'as:put'];
ActionsScriptsUpload.flags = Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }), type: command_1.flags.string({
        char: 't',
        description: 'script type',
        options: ['post', 'pre'],
        required: true,
    }), yes: command_1.flags.boolean({ char: 'y', description: 'skip confirmation' }) });
ActionsScriptsUpload.args = [
    {
        name: 'action_id',
        description: 'action_id from hexabase',
        required: true,
    },
    {
        name: 'file',
        description: 'file to be uploaded, e.g. script.js',
        required: true,
    },
];
