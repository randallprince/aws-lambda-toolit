"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const status_code_enum_1 = __importDefault(require("status-code-enum"));
exports.isParseable = (json) => {
    if (!json) {
        return false;
    }
    try {
        JSON.parse(json);
        return true;
    }
    catch (err) {
        return false;
    }
};
exports.invalidJsonError = {
    statusCode: status_code_enum_1.default.ClientErrorBadRequest,
    body: JSON.stringify({
        errors: [
            {
                code: 'invalid.json',
                message: 'JSON supplied to request is invalid',
                properties: [
                    {
                        property: 'request.body',
                    },
                ],
            },
        ],
    }),
};
