"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poller = void 0;
const wait_1 = require("./wait");
/* eslint-disable no-await-in-loop */
class Poller {
    constructor(maxAttempts) {
        this._attempts = 0;
        this._maxAttempts = maxAttempts;
    }
    async poll(fn, retryCondition, ms) {
        let result = await fn();
        while (retryCondition(result)) {
            if (this._maxAttempts > -1 && this._attempts >= this._maxAttempts) {
                break;
            }
            this._attempts += 1;
            await (0, wait_1.wait)(ms);
            result = await fn();
        }
        return result;
    }
}
exports.Poller = Poller;
