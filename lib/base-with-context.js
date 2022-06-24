"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const conf_1 = tslib_1.__importDefault(require("conf"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const api_client_1 = require("./api/api-client");
const sse_client_1 = require("./api/sse-client");
class BaseWithContext extends command_1.Command {
    constructor() {
        super(...arguments);
        this.hexaConfig = new conf_1.default();
    }
    get hexaAPI() {
        return this._hexaAPI;
    }
    get hexaSSE() {
        return this._hexaSSE;
    }
    configureHexaAPI() {
        let authConfig = {};
        const token = this.hexaConfig.get(`hexabase.${this.currentContext}.token`);
        if (token) {
            authConfig = {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            };
        }
        this._hexaAPI = new api_client_1.APIClient(this.context.server, authConfig);
    }
    configureHexaSSE() {
        this._hexaSSE = new sse_client_1.SSEClient(this.context.sse);
    }
    async init() {
        const { flags } = this.parse(this.constructor);
        if (flags.context) {
            this.currentContext = flags.context;
        }
        else {
            this.currentContext = this.hexaConfig.get('current-context');
            if (!this.currentContext) {
                throw new Error(`Missing context setting: ${chalk_1.default.red('current-context')}`);
            }
        }
        const context = this.hexaConfig.get(`contexts.${this.currentContext}`);
        if (!context) {
            throw new Error(`No such context: ${chalk_1.default.red(flags.context)}`);
        }
        this.context = context;
        this.configureHexaAPI();
        this.configureHexaSSE();
    }
}
exports.default = BaseWithContext;
BaseWithContext.flags = {
    context: command_1.flags.string({ char: 'c', description: 'use provided context instead of currently set context' }),
};
