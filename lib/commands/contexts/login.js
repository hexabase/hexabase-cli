"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const enquirer_1 = require("enquirer");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const base_with_context_1 = tslib_1.__importDefault(require("../../base-with-context"));
class ContextsLogin extends base_with_context_1.default {
    constructor() {
        super(...arguments);
        this.questions = [
            {
                type: 'input',
                name: 'email',
                message: `Enter your ${chalk_1.default.cyan('email')}`,
            },
            {
                type: 'password',
                name: 'password',
                message: `Enter your ${chalk_1.default.cyan('password')}`,
            },
        ];
    }
    async run() {
        const { flags } = this.parse(ContextsLogin);
        let { email, password } = flags;
        if (!flags.email) {
            ({ email } = await (0, enquirer_1.prompt)(this.questions[0]));
        }
        if (!flags.password) {
            ({ password } = await (0, enquirer_1.prompt)(this.questions[1]));
        }
        const data = { email, password };
        try {
            let url = '/api/v0/login';
            const { data: { token } } = await this.hexaAPI.post(url, data);
            this.hexaConfig.set(`hexabase.${this.currentContext}.email`, email);
            this.hexaConfig.set(`hexabase.${this.currentContext}.token`, token);
            this.configureHexaAPI();
            url = '/api/v0/userinfo';
            const { data: { u_id } } = await this.hexaAPI.get(url);
            this.hexaConfig.set(`hexabase.${this.currentContext}.user_id`, u_id);
            this.log(`Successfully logged in as: ${chalk_1.default.cyan(email)}`);
        }
        catch (error) {
            this.log(`Login ${chalk_1.default.red('failed')} for ${chalk_1.default.cyan(email)}`);
            this.debug(error);
            throw error;
        }
    }
}
exports.default = ContextsLogin;
ContextsLogin.description = 'login to hexabase within current context';
ContextsLogin.aliases = ['login'];
ContextsLogin.flags = Object.assign(Object.assign({}, base_with_context_1.default.flags), { help: command_1.flags.help({ char: 'h' }), email: command_1.flags.string({ char: 'u', description: 'user email address to login' }), password: command_1.flags.string({ char: 'p', description: 'login password' }) });
