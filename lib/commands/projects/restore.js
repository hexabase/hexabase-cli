"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const enquirer_1 = require("enquirer");
const cli_ux_1 = tslib_1.__importDefault(require("cli-ux"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const form_data_1 = tslib_1.__importDefault(require("form-data"));
const base_with_context_1 = tslib_1.__importDefault(require("../../base-with-context"));
const poller_1 = require("../../helpers/poller");
class ProjectsRestore extends base_with_context_1.default {
    constructor() {
        super(...arguments);
        this.questions = [
            {
                type: 'input',
                name: 'projectName',
                message: 'Please provide the name for your project',
                validate: function (input) {
                    if (input.length === 0) {
                        return 'Cannot be empty';
                    }
                    return input.length !== 0;
                },
            },
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Do you want to proceed?',
            },
        ];
    }
    async run() {
        var _a;
        const { args, flags } = this.parse(ProjectsRestore);
        const noNameFlag = typeof flags.name === 'undefined';
        try {
            if (noNameFlag) {
                flags.name = await (0, enquirer_1.prompt)(this.questions[0]).then(({ projectName }) => projectName);
            }
            const url = '/api/v0/workspaces';
            const { data: workspaceResponse } = await this.hexaAPI.get(url);
            const currentWorkspace = workspaceResponse.workspaces.find((ws) => {
                return ws.workspace_id === workspaceResponse.current_workspace_id;
            });
            let shouldProceed = false;
            if (flags.yes) {
                shouldProceed = true;
            }
            else {
                this.log(`You are about to restore the template to:
  workspace: ${chalk_1.default.cyan(currentWorkspace === null || currentWorkspace === void 0 ? void 0 : currentWorkspace.workspace_name)}
  context: ${chalk_1.default.cyan(this.currentContext)}`);
                shouldProceed = await (0, enquirer_1.prompt)(this.questions[1]).then(({ confirm }) => confirm);
            }
            if (shouldProceed) {
                cli_ux_1.default.action.start(`Restoring template from file ${chalk_1.default.cyan(args.file)}`);
                const url = '/api/v0/templates/upload';
                const form = new form_data_1.default();
                form.append('file', fs_1.default.createReadStream(args.file));
                form.append('name', flags.name);
                const token = this.hexaConfig.get(`hexabase.${this.currentContext}.token`);
                const requestConfig = {
                    headers: Object.assign({ authorization: `Bearer ${token}` }, form.getHeaders()),
                };
                const { data: template } = await this.hexaAPI.post(url, form, requestConfig);
                cli_ux_1.default.action.start('Task successfully queued');
                const poller = new poller_1.Poller(-1); // wait until we get a response
                const tasksUrl = `/api/v0/tasks?category=UPLOADTEMPLATE&all=true&stream_id=${template.stream_id}`;
                const fn = () => this.hexaAPI.get(tasksUrl);
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
                        taskStatusMessage = `Template file successfully uploaded, project successfully restored`;
                        break;
                    case 3:
                    case 4:
                        throw new Error('Template uploading or project restoring unsuccessful');
                    default:
                        taskStatusMessage = 'Could not determine task status';
                }
                this.log(taskStatusMessage);
            }
            else {
                this.log(chalk_1.default.red('Restoring aborted'));
            }
        }
        finally {
            if (noNameFlag) {
                this.log("You can specify the name of the project with the '--name' flag in the future");
            }
        }
    }
}
exports.default = ProjectsRestore;
ProjectsRestore.description = 'restore a project from a template file';
ProjectsRestore.aliases = ['pj:restore'];
ProjectsRestore.flags = Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }), name: command_1.flags.string({ char: 'n', description: 'name of the project to be restored' }), yes: command_1.flags.boolean({ char: 'y', description: 'skip confirmation' }) });
ProjectsRestore.args = [
    {
        name: 'file',
        description: 'zip file to be restored from, e.g. template.zip',
        required: true,
    },
];
