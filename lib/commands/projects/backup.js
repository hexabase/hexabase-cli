"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const enquirer_1 = require("enquirer");
const cli_ux_1 = tslib_1.__importDefault(require("cli-ux"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const download_1 = tslib_1.__importDefault(require("download"));
const base_with_context_1 = tslib_1.__importDefault(require("../../base-with-context"));
class ProjectsBackup extends base_with_context_1.default {
    constructor() {
        super(...arguments);
        this.questions = [
            {
                type: 'select',
                name: 'template',
                message: 'Select a template',
                choices: [],
            },
            {
                type: 'input',
                name: 'output',
                message: `Specify the ${chalk_1.default.cyan('output')} of the template file`,
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
        const { args, flags } = this.parse(ProjectsBackup);
        const noOutputFlag = typeof flags.output === 'undefined';
        try {
            if (!args.template_id) {
                const url = '/api/v0/templates';
                const { data: templates } = await this.hexaAPI.get(url);
                if (templates.categories.length === 0) {
                    return this.log(chalk_1.default.red('No template found'));
                }
                this.questions[0].choices = templates.categories.reduce((acc, ctg) => {
                    ctg.templates.forEach(tmp => {
                        const elem = {
                            name: tmp.tp_id,
                            message: tmp.name,
                            value: tmp.tp_id,
                            hint: tmp.tp_id,
                        };
                        acc.push(elem);
                    });
                    return acc;
                }, []);
                const { template: template_id } = await (0, enquirer_1.prompt)(this.questions[0]);
                args.template_id = template_id;
            }
            // specify filename
            if (noOutputFlag) {
                this.questions[1].initial = `${args.template_id}.zip`;
                flags.output = await (0, enquirer_1.prompt)(this.questions[1]).then(({ output }) => output);
            }
            // download from apicore
            cli_ux_1.default.action.start(`Downloading template with tp_id ${chalk_1.default.cyan(args.template_id)}`);
            const url = `${this.context.server}/api/v0/templates/${args.template_id}/download`;
            const token = this.hexaConfig.get(`hexabase.${this.currentContext}.token`);
            const downloadOptions = {
                mode: '666',
                filename: flags.output,
                headers: {
                    accept: 'application/zip',
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
exports.default = ProjectsBackup;
ProjectsBackup.description = 'download template file';
ProjectsBackup.aliases = ['pj:backup'];
ProjectsBackup.flags = Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }), output: command_1.flags.string({ char: 'o', description: 'output file' }) });
ProjectsBackup.args = [
    {
        name: 'template_id',
        description: 'template_id from hexabase',
    },
];
