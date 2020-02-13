import { DynamoDB } from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { Dynamo } from '../interfaces';
declare type Options = DynamoDB.DocumentClient.DocumentClientOptions & ServiceConfigurationOptions & DynamoDB.ClientApiVersions;
declare class DynamoClient {
    private _docClient;
    constructor(options?: Options);
    scan: <T = DynamoDB.DocumentClient.AttributeMap>(request: DynamoDB.DocumentClient.ScanInput) => Dynamo.ScanOutput<T>;
    query: <T = DynamoDB.DocumentClient.AttributeMap>(request: DynamoDB.DocumentClient.QueryInput) => Dynamo.QueryOutput<T>;
    get: <T = DynamoDB.DocumentClient.AttributeMap>(request: DynamoDB.DocumentClient.GetItemInput) => Dynamo.GetItemOutput<T>;
    batchGet: (request: DynamoDB.DocumentClient.BatchGetItemInput) => Dynamo.BatchGetOutput;
    put: (request: DynamoDB.DocumentClient.PutItemInput) => Dynamo.PutItemOutput;
    createSet: (request: Dynamo.CreateSetInput) => Dynamo.CreateSetOutput;
    update: (request: DynamoDB.DocumentClient.UpdateItemInput) => Dynamo.PutItemOutput;
    deleteRecord: (request: DynamoDB.DocumentClient.DeleteItemInput) => Dynamo.DeleteItemOutput;
}
export declare const dynamo: DynamoClient;
export declare const createDynamo: (options: Options) => DynamoClient;
export {};
