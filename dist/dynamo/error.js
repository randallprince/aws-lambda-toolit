"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DynamoDBError extends Error {
    constructor(message, code) {
        super(message);
        if (code) {
            this.code = code;
        }
        this.name = 'DynamoDBError';
    }
}
exports.DynamoDBError = DynamoDBError;
