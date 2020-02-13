"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
const error_1 = require("./error");
class DynamoClient {
    constructor(options = {}) {
        this.scan = async (request) => {
            try {
                return (await this._docClient.scan(request).promise());
            }
            catch (err) {
                throw new error_1.DynamoDBError(err, err.code);
            }
        };
        this.query = async (request) => {
            try {
                return (await this._docClient.query(request).promise());
            }
            catch (err) {
                throw new error_1.DynamoDBError(err, err.code);
            }
        };
        this.get = async (request) => {
            try {
                return (await this._docClient.get(request).promise());
            }
            catch (err) {
                throw new error_1.DynamoDBError(err, err.code);
            }
        };
        this.batchGet = async (request) => {
            try {
                return await this._docClient.batchGet(request).promise();
            }
            catch (err) {
                throw new error_1.DynamoDBError(err, err.code);
            }
        };
        this.put = async (request) => {
            try {
                return await this._docClient.put(request).promise();
            }
            catch (err) {
                throw new error_1.DynamoDBError(err, err.code);
            }
        };
        this.createSet = async (request) => {
            try {
                return await this._docClient.createSet(request);
            }
            catch (err) {
                throw new error_1.DynamoDBError(err, err.code);
            }
        };
        this.update = async (request) => {
            try {
                return await this._docClient.update(request).promise();
            }
            catch (err) {
                throw new error_1.DynamoDBError(err, err.code);
            }
        };
        this.deleteRecord = async (request) => {
            try {
                return await this._docClient.delete(request).promise();
            }
            catch (err) {
                throw new error_1.DynamoDBError(err, err.code);
            }
        };
        this._docClient = new aws_sdk_1.DynamoDB.DocumentClient({
            maxRetries: 5,
            httpOptions: {
                timeout: 5000,
            },
            ...options,
        });
    }
}
exports.dynamo = new DynamoClient();
exports.createDynamo = (options) => new DynamoClient(options);
