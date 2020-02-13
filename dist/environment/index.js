"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Environment {
    constructor() {
        this.getEnvironmentVar = (name) => {
            var _a;
            if (typeof name !== 'string') {
                throw new Error(`${name} is not a valid environment variable`);
            }
            const variable = (_a = process.env[name], (_a !== null && _a !== void 0 ? _a : ''));
            return variable;
        };
        this.setEnvironmentVar = (name, value) => {
            if (typeof name !== 'string') {
                throw new Error(`${name} is not a valid environment variable`);
            }
            if (typeof value !== 'string') {
                throw new Error(`${value} is not a valid environment variable value`);
            }
            process.env[name] = value;
            return this.getEnvironmentVar(name) === value;
        };
        this.apiBaseUrl = () => {
            return this.getEnvironmentVar('API_BASE_URL');
        };
        this.tableName = () => {
            return this.getEnvironmentVar('TABLE_NAME');
        };
        this.serviceName = () => {
            return this.getEnvironmentVar('SERVICE_NAME');
        };
        this.eventName = () => {
            return this.getEnvironmentVar('SERVICE_NAME').toUpperCase();
        };
        this.isOffline = () => {
            return !!process.env.IS_OFFLINE;
        };
    }
}
exports.env = new Environment();
