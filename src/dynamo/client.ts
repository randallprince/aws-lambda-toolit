import { DynamoDB } from 'aws-sdk';
import { DocumentClient as DynamoDocClient } from 'aws-sdk/lib/dynamodb/document_client';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { Dynamo } from '../interfaces';
import { DynamoDBError } from './error';

type Options = DynamoDB.DocumentClient.DocumentClientOptions & ServiceConfigurationOptions & DynamoDB.ClientApiVersions;

class DynamoClient {
  private _docClient: Dynamo.DocumentClient;
  constructor(options: Options = {}) {
    this._docClient = new DynamoDB.DocumentClient({
      maxRetries: 5,
      httpOptions: {
        timeout: 5000,
      },
      ...options,
    });
  }

  public scan = async <T = DynamoDocClient.AttributeMap>(request: Dynamo.ScanInput): Dynamo.ScanOutput<T> => {
    try {
      return ((await this._docClient.scan(request).promise()) as any) as Dynamo.ScanOutput<T>;
    } catch (err) {
      throw new DynamoDBError(err, err.code);
    }
  };

  public query = async <T = DynamoDocClient.AttributeMap>(request: Dynamo.QueryInput): Dynamo.QueryOutput<T> => {
    try {
      return ((await this._docClient.query(request).promise()) as any) as Dynamo.QueryOutput<T>;
    } catch (err) {
      throw new DynamoDBError(err, err.code);
    }
  };

  public get = async <T = DynamoDocClient.AttributeMap>(request: Dynamo.GetItemInput): Dynamo.GetItemOutput<T> => {
    try {
      return ((await this._docClient.get(request).promise()) as any) as Dynamo.GetItemOutput<T>;
    } catch (err) {
      throw new DynamoDBError(err, err.code);
    }
  };

  public batchGet = async (request: Dynamo.BatchGetInput): Dynamo.BatchGetOutput => {
    try {
      return await this._docClient.batchGet(request).promise();
    } catch (err) {
      throw new DynamoDBError(err, err.code);
    }
  };

  public put = async (request: Dynamo.PutItemInput): Dynamo.PutItemOutput => {
    try {
      return await this._docClient.put(request).promise();
    } catch (err) {
      throw new DynamoDBError(err, err.code);
    }
  };

  public createSet = async (request: Dynamo.CreateSetInput): Dynamo.CreateSetOutput => {
    try {
      return await this._docClient.createSet(request);
    } catch (err) {
      throw new DynamoDBError(err, err.code);
    }
  };

  public update = async (request: Dynamo.UpdateItemInput): Dynamo.PutItemOutput => {
    try {
      return await this._docClient.update(request).promise();
    } catch (err) {
      throw new DynamoDBError(err, err.code);
    }
  };

  public deleteRecord = async (request: Dynamo.DeleteItemInput): Dynamo.DeleteItemOutput => {
    try {
      return await this._docClient.delete(request).promise();
    } catch (err) {
      throw new DynamoDBError(err, err.code);
    }
  };
}

export const dynamo = new DynamoClient();
export const createDynamo = (options: Options): DynamoClient => new DynamoClient(options);
