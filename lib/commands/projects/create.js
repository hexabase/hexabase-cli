"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const enquirer_1 = require("enquirer");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const base_with_context_1 = tslib_1.__importDefault(require("../../base-with-context"));
class ProjectsCreate extends base_with_context_1.default {
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
                type: 'form',
                name: 'projectName',
                message: 'Please provide the name for your project',
                choices: [
                    { name: 'en', message: 'Project Name (en)', validate(value) {
                            return value.length > 0;
                        } },
                    { name: 'ja', message: 'Project Name (ja)', validate(value) {
                            return value.length > 0;
                        } },
                ],
                validate(value) {
                    return (value.en.length > 0 && value.ja.length > 0) ? true : 'Cannot be empty';
                },
            },
        ];
    }
    async run() {
        this.parse(ProjectsCreate);
        let url = '/api/v0/templates';
        const { data: templates } = await this.hexaAPI.get(url);
        const initalChoice = [{
                name: 'none',
                message: 'none',
                value: 'none',
                hint: '',
            }];
        this.questions[0].choices = templates.categories.reduce((acc, ctg) => {
            ctg.templates.forEach(tmp => {
                const elem = {
                    name: tmp.tp_id,
                    message: tmp.name,
                    hint: tmp.tp_id,
                };
                acc.push(elem);
            });
            return acc;
        }, initalChoice);
        const { template: template_id } = await (0, enquirer_1.prompt)(this.questions[0]);
        const { projectName } = await (0, enquirer_1.prompt)(this.questions[1]);
        this.log(`Project Name (en): ${chalk_1.default.cyan(projectName.en)}`);
        this.log(`Project Name (ja): ${chalk_1.default.cyan(projectName.ja)}`);
        const data = { name: projectName };
        if (template_id !== 'none') {
            data.tp_id = template_id;
        }
        url = '/api/v0/applications';
        const { data: project } = await this.hexaAPI.post(url, data);
        this.log(`Task successfully queued. project_id set to: ${chalk_1.default.cyan(project.project_id)}`);
    }
}
exports.default = ProjectsCreate;
ProjectsCreate.description = 'create new project within current workspace';
ProjectsCreate.flags = Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }) });
