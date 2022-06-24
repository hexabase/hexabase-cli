"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSEClient = void 0;
const tslib_1 = require("tslib");
const eventsource_1 = tslib_1.__importDefault(require("eventsource"));
class SSEClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.source = null;
    }
    connect(url) {
        this.source = new eventsource_1.default(`${this.baseUrl}${url}`);
    }
}
exports.SSEClient = SSEClient;
