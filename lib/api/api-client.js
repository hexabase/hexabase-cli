"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
class APIClient {
    constructor(baseUrl, baseConfig = {}) {
        this.baseUrl = baseUrl;
        this.baseConfig = baseConfig;
        this._http = axios_1.default;
    }
    get(url, config = {}) {
        return this._http.get(`${this.baseUrl}${url}`, Object.assign(Object.assign({}, this.baseConfig), config));
    }
    post(url, data = {}, config = {}) {
        return this._http.post(`${this.baseUrl}${url}`, data, Object.assign(Object.assign({}, this.baseConfig), config));
    }
    put(url, data = {}, config = {}) {
        return this._http.put(`${this.baseUrl}${url}`, data, Object.assign(Object.assign({}, this.baseConfig), config));
    }
    patch(url, data = {}, config = {}) {
        return this._http.patch(`${this.baseUrl}${url}`, data, Object.assign(Object.assign({}, this.baseConfig), config));
    }
    delete(url, config = {}) {
        return this._http.delete(`${this.baseUrl}${url}`, Object.assign(Object.assign({}, this.baseConfig), config));
    }
}
exports.APIClient = APIClient;
