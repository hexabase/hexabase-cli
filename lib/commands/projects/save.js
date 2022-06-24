"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const enquirer_1 = require("enquirer");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const cli_ux_1 = tslib_1.__importDefault(require("cli-ux"));
const download_1 = tslib_1.__importDefault(require("download"));
const base_with_context_1 = tslib_1.__importDefault(require("../../base-with-context"));
const poller_1 = require("../../helpers/poller");
class ProjectsSave extends base_with_context_1.default {
    constructor() {
        super(...arguments);
        this.questions = [
            {
                type: 'select',
                name: 'project',
                message: 'Select a project',
                choices: [],
            },
            {
                type: 'form',
                name: 'templateForm',
                message: 'Please provide details for your project template',
                choices: [
                    { name: 'name', message: 'Name', validate(value) {
                            return value.length > 0;
                        } },
                    { name: 'category', message: 'Category', validate(value) {
                            return value.length > 0;
                        } },
                    { name: 'description', message: 'Description' },
                ],
                validate(value) {
                    return (value.name.length > 0 && value.category.length > 0) ? true : 'Cannot be empty';
                },
            },
            {
                type: 'toggle',
                name: 'includeHistories',
                message: 'Include histories',
                enabled: 'Yes',
                disabled: 'No',
            },
        ];
    }
    async run() {
        var _a;
        const { args, flags } = this.parse(ProjectsSave);
        if (!args.project_id) {
            let url = '/api/v0/workspacecurrent';
            const { data: currentWorkspace } = await this.hexaAPI.get(url);
            url = `/api/v0/workspaces/${currentWorkspace.workspace_id}/applications`;
            const { data: projects } = await this.hexaAPI.get(url);
            if (projects.length === 0) {
                return this.log(chalk_1.default.red('No project found'));
            }
            this.questions[0].choices = projects.reduce((acc, pj) => {
                const elem = {
                    name: pj.application_id,
                    message: pj.name,
                    value: pj.application_id,
                    hint: pj.application_id,
                };
                acc.push(elem);
                return acc;
            }, []);
            const { project: project_id } = await (0, enquirer_1.prompt)(this.questions[0]);
            args.project_id = project_id;
        }
        const { templateForm } = await (0, enquirer_1.prompt)(this.questions[1]);
        this.log(`Name: ${chalk_1.default.cyan(templateForm.name)}`);
        this.log(`Category: ${chalk_1.default.cyan(templateForm.category)}`);
        if (templateForm.description !== '') {
            this.log(`Description: ${chalk_1.default.cyan(templateForm.description)}`);
        }
        const { includeHistories } = await (0, enquirer_1.prompt)(this.questions[2]);
        const newProjectReq = Object.assign({ project_id: args.project_id, include_histories: includeHistories }, templateForm);
        let url = '/api/v0/templates';
        const { data: template } = await this.hexaAPI.post(url, newProjectReq);
        cli_ux_1.default.action.start('Task successfully queued');
        const poller = new poller_1.Poller(-1); // wait until we get a response
        url = `/api/v0/tasks?category=SAVETEMPLATE&all=true&stream_id=${template.stream_id}`;
        const fn = () => this.hexaAPI.get(url);
        const retryCondition = ({ data }) => {
            const queueTask = data[Object.keys(data)[0]];
            // StatusQueued: 0, StatusProgress: 1, StatusDone: 2, StatusError: 3, StatusDead: 4
            return queueTask.status.id < 2;
        };
        const { data } = await poller.poll(fn, retryCondition, 1000);
        cli_ux_1.default.action.stop();
        const queueTask = data[Object.keys(data)[0]];
        let taskStatusMessage = '';
        switch ((_a = queueTask === null || queueTask === void 0 ? void 0 : queueTask.status) === null || _a === void 0 ? void 0 : _a.id) {
            case 2:
                taskStatusMessage = `Template with tp_id ${chalk_1.default.cyan(template.tp_id)} successfully created`;
                break;
            case 3:
            case 4:
                throw new Error('Template creation unsuccessful');
            default:
                taskStatusMessage = 'Could not determine task status';
        }
        this.log(taskStatusMessage);
        // download from apicore
        if (flags.download) {
            cli_ux_1.default.action.start(`Downloading template with tp_id ${chalk_1.default.cyan(template.tp_id)}`);
            url = `${this.context.server}/api/v0/templates/${template.tp_id}/download`;
            const token = this.hexaConfig.get(`hexabase.${this.currentContext}.token`);
            const downloadOptions = {
                mode: '666',
                filename: flags.download,
                headers: {
                    accept: 'application/zip',
                    authorization: `Bearer ${token}`,
                },
            };
            await (0, download_1.default)(url, './', downloadOptions);
            cli_ux_1.default.action.stop();
        }
    }
}
exports.default = ProjectsSave;
ProjectsSave.description = 'save template from a project';
ProjectsSave.aliases = ['pj:save'];
ProjectsSave.flags = Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }), download: command_1.flags.string({
        char: 'd',
        description: 'download output file (e.g. my_template.zip)',
    }) });
ProjectsSave.args = [
    {
        name: 'project_id',
        description: 'project_id from hexabase',
    },
];
