"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("../environment");
class Href {
    constructor() {
        this.buildHref = (urlType, guid) => {
            if (typeof urlType !== 'string') {
                throw new Error(`Type is not a valid string`);
            }
            if (typeof guid !== 'string') {
                throw new Error(`GUID is not a valid string`);
            }
            return `${this.API_BASE_URL()}/${urlType}/${guid}`;
        };
        this.buildHrefWithService = (urlType, guid) => {
            if (typeof urlType !== 'string') {
                throw new Error(`Type is not a valid string`);
            }
            if (typeof guid !== 'string') {
                throw new Error(`GUID is not a valid string`);
            }
            return `${this.API_BASE_URL()}${this.EVENT_NAME()}/${urlType}/${guid}`;
        };
        this.buildIdHref = (urlType, guid) => {
            if (typeof urlType !== 'string') {
                throw new Error(`Type is not a valid string`);
            }
            if (typeof guid !== 'string') {
                throw new Error(`guid is not a valid string`);
            }
            return `${this.API_BASE_URL()}/${urlType}/id/${guid}`;
        };
        this.extractId = (href) => {
            if (typeof href !== 'string') {
                throw new Error(`Href is not a valid string`);
            }
            const match = this.UUID_REGEX.exec(href);
            return match ? match[1] : undefined;
        };
        this.getStringId = (href) => {
            var _a;
            if (typeof href !== 'string') {
                throw new Error(`Href is not a valid string`);
            }
            const match = this.UUID_REGEX.exec(href);
            return match ? (_a = match) === null || _a === void 0 ? void 0 : _a[1] : '';
        };
        // if the regex fails and the pattern is not found (result === null), the function fails and returns false
        this.validateHref = (uri) => {
            const regex = new RegExp('([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})$', 'i');
            const urlSplit = uri.split(/\//).pop();
            if (urlSplit !== undefined) {
                const result = regex.exec(urlSplit);
                if (result === null) {
                    return false;
                }
            }
            return true;
        };
        // if the regex fails and the pattern is not found (result === null), the function fails and returns false
        this.validateTypeGuid = (urlType, uri) => {
            const regex = new RegExp(`(.*)/${urlType.replace('/', '/')}/([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})$`, 'i');
            return regex.exec(uri) !== null;
        };
        this.validateUUID = (uuid) => {
            return this.UUID_REGEX.exec(uuid) !== null;
        };
        this.UUID_REGEX = new RegExp(/([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/i);
        this.API_BASE_URL = () => environment_1.env.apiBaseUrl();
        this.EVENT_NAME = () => environment_1.env.eventName();
    }
}
exports.href = new Href();
