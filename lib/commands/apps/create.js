"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const fs_1 = require("fs");
const enquirer_1 = require("enquirer");
const yarn_or_npm_1 = require("yarn-or-npm");
const cli_ux_1 = tslib_1.__importDefault(require("cli-ux"));
const download_1 = tslib_1.__importDefault(require("download"));
const path_1 = tslib_1.__importDefault(require("path"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const urlMap = {
    vue: 'https://github.com/b-eee/hexa-vue-example1/archive/develop.zip',
};
class AppsCreate extends command_1.Command {
    constructor() {
        super(...arguments);
        this.questions = [
            {
                type: 'input',
                name: 'name',
                message: `Specify the ${chalk_1.default.cyan('name')} of your app`,
                validate: function (input) {
                    if (input.length === 0) {
                        return 'Cannot be empty';
                    }
                    return input.length !== 0;
                },
            },
            {
                type: 'select',
                name: 'template',
                message: 'Select a template',
                choices: ['vue'],
            },
        ];
    }
    async run() {
        const { flags } = this.parse(AppsCreate);
        const noNameFlag = typeof flags.name === 'undefined';
        try {
            // prompt: name (if not specified as flag --name)
            if (noNameFlag) {
                flags.name = await (0, enquirer_1.prompt)(this.questions[0]).then(({ name }) => name);
            }
            // check if folder already exists
            const isExistsDir = (0, fs_1.readdirSync)('.', { withFileTypes: true }).some(dirent => dirent.isDirectory() && dirent.name === flags.name);
            if (isExistsDir) {
                throw new Error('Folder with same name already exists');
            }
            // prompt: template
            const { template } = await (0, enquirer_1.prompt)(this.questions[1]);
            // download from github
            cli_ux_1.default.action.start(`Initializing app with name ${chalk_1.default.cyan(flags.name)}`);
            const url = urlMap[template];
            const downloadOptions = {
                extract: true,
                strip: 1,
                mode: '666',
                headers: {
                    accept: 'application/zip',
                },
            };
            await (0, download_1.default)(url, flags.name, downloadOptions);
            cli_ux_1.default.action.stop();
            // install npm packages of app
            const name = flags.name;
            const outDir = path_1.default.join(process.cwd(), name);
            process.chdir(outDir);
            cli_ux_1.default.action.start('Installing dependencies');
            yarn_or_npm_1.spawn.sync(['install'], { stdio: 'inherit' });
            cli_ux_1.default.action.stop();
        }
        finally {
            if (noNameFlag) {
                this.log("You can specify the name of your app with the '--name' flag in the future");
            }
        }
    }
}
exports.default = AppsCreate;
AppsCreate.description = 'download & create new app from a template';
AppsCreate.flags = {
    help: command_1.flags.help({ char: 'h' }),
    name: command_1.flags.string({ char: 'n', description: 'name of your app' }),
};
