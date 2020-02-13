"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JoiSchemaValidationError {
    constructor({ code, message, properties }) {
        this.code = code;
        this.message = message;
        this.properties = properties;
    }
}
exports.JoiSchemaValidationError = JoiSchemaValidationError;
exports.formatValidationErrors = errors => {
    const formattedErrors = errors.details.map(error => new JoiSchemaValidationError({
        code: error.type,
        message: error.message.replace(/"/g, ''),
        properties: [{ property: error.path.join('.') }],
    }));
    return { errors: formattedErrors };
};
