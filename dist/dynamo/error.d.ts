export declare class DynamoDBError extends Error {
    code?: string;
    constructor(message: string, code?: string);
}
