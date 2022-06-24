"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const fs_1 = require("fs");
const jsonschema_1 = require("jsonschema");
const enquirer_1 = require("enquirer");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const base_with_context_1 = tslib_1.__importDefault(require("../../base-with-context"));
const v = new jsonschema_1.Validator();
const settingsSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'object',
            required: true,
            properties: {
                en: {
                    type: 'string',
                    minLength: 1,
                    required: true,
                },
                ja: {
                    type: 'string',
                    minLength: 1,
                    required: true,
                },
            },
        },
        tp_id: {
            type: 'string',
            minLength: 1,
            required: true,
        },
    },
};
class AppsInit extends base_with_context_1.default {
    constructor() {
        super(...arguments);
        this.questions = [
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
        const { flags } = this.parse(AppsInit);
        const hxSettingsFile = flags.file;
        if (!(0, fs_1.existsSync)(hxSettingsFile)) {
            throw new Error(`${chalk_1.default.red(hxSettingsFile)} file not found`);
        }
        const hxSettings = JSON.parse((0, fs_1.readFileSync)(hxSettingsFile, 'utf8'));
        // no 'name' field in hxSettings -> form prompt
        if (!Object.prototype.hasOwnProperty.call(hxSettings, 'name')) {
            const { projectName } = await (0, enquirer_1.prompt)(this.questions[0]);
            this.log(`Project Name (en): ${chalk_1.default.cyan(projectName.en)}`);
            this.log(`Project Name (ja): ${chalk_1.default.cyan(projectName.ja)}`);
            Object.assign(hxSettings, { name: projectName });
        }
        // json schema validation
        const validatorResult = v.validate(hxSettings, settingsSchema);
        if (validatorResult.errors.length > 0) {
            throw new Error(`JSON Schema\n${validatorResult.toString()}`);
        }
        const url = '/api/v0/applications';
        const { data: project } = await this.hexaAPI.post(url, hxSettings);
        this.log(`Task successfully queued:
project_id: ${chalk_1.default.cyan(project.project_id)}`);
    }
}
exports.default = AppsInit;
AppsInit.description = 'initialize app with hexabase settings';
AppsInit.aliases = ['init'];
AppsInit.flags = Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }), file: command_1.flags.string({ char: 'f', description: 'hexabase settings file', default: 'hx-settings.json' }) });
