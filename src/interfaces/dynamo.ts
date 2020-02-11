import {
  ExpressionAttributeNameMap,
  ExpressionAttributeValueMap,
  ExpressionAttributeNameVariable,
  ExpressionAttributeValueVariable,
  UpdateExpression as updateExpression,
  Key,
  Integer,
  ConsumedCapacity,
} from 'aws-sdk/clients/dynamodb';
import { DocumentClient as DynamoDocClient } from 'aws-sdk/lib/dynamodb/document_client';

export interface GetItemOutputGeneric<T> {
  Item?: T;
  /**
   * The capacity units consumed by the GetItem operation. The data returned includes the total provisioned
   * throughput consumed, along with statistics for the table and any indexes involved in the operation.
   * ConsumedCapacity is only returned if the ReturnConsumedCapacity parameter was specified.
   * For more information, see Read/Write Capacity Mode in the Amazon DynamoDB Developer Guide.
   */
  ConsumedCapacity?: ConsumedCapacity;
}

export interface GetQueryOutputGeneric<T> {
  /**
   * An array of item attributes that match the query criteria. Each element in this array consists of an attribute name and the value for that attribute.
   */
  Items?: T[];
  /**
   * The number of items in the response. If you used a QueryFilter in the request, then Count is the number of items returned after the filter was applied, and ScannedCount is the number of matching items before the filter was applied. If you did not use a filter in the request, then Count and ScannedCount are the same.
   */
  Count?: Integer;
  /**
   * The number of items evaluated, before any QueryFilter is applied. A high ScannedCount value with few, or no, Count results indicates an inefficient Query operation. For more information, see Count and ScannedCount in the Amazon DynamoDB Developer Guide. If you did not use a filter in the request, then ScannedCount is the same as Count.
   */
  ScannedCount?: Integer;
  /**
   * The primary key of the item where the operation stopped, inclusive of the previous result set. Use this value to start a new operation, excluding this value in the new request. If LastEvaluatedKey is empty, then the "last page" of results has been processed and there is no more data to be retrieved. If LastEvaluatedKey is not empty, it does not necessarily mean that there is more data in the result set. The only way to know when you have reached the end of the result set is when LastEvaluatedKey is empty.
   */
  LastEvaluatedKey?: Key;
  /**
   * The capacity units consumed by the Query operation. The data returned includes the total provisioned throughput consumed, along with statistics for the table and any indexes involved in the operation. ConsumedCapacity is only returned if the ReturnConsumedCapacity parameter was specified. For more information, see Provisioned Throughput in the Amazon DynamoDB Developer Guide.
   */
  ConsumedCapacity?: ConsumedCapacity;
}

export namespace Dynamo {
  export type ScanInput = DynamoDocClient.ScanInput;
  export type ScanOutput<T = DynamoDocClient.ScanOutput> = Promise<T>;
  export type QueryOutputBase = DynamoDocClient.QueryOutput;
  export type GetOutputBase = DynamoDocClient.GetItemOutput;
  export type DocumentClient = DynamoDocClient;
  export type QueryInput = DynamoDocClient.QueryInput;
  export type QueryOutput<T> = Promise<GetQueryOutputGeneric<T>>;
  export type GetItemInput = DynamoDocClient.GetItemInput;
  export type GetItemOutput<T> = Promise<GetItemOutputGeneric<T>>;
  export type PutItemInput = DynamoDocClient.PutItemInput;
  export type PutItemOutput = Promise<DynamoDocClient.PutItemOutput>;
  export type CreateSetInput = number[] | string[] | DynamoDocClient.binaryType[];
  export type CreateSetOutput = Promise<DynamoDocClient.DynamoDbSet>;
  export type UpdateItemInput = DynamoDocClient.UpdateItemInput;
  export type UpdateItemOutput = Promise<DynamoDocClient.PutItemOutput>;
  export type DeleteItemInput = DynamoDocClient.DeleteItemInput;
  export type DeleteItemOutput = Promise<DynamoDocClient.DeleteItemOutput>;
  export type AttributeValue = ExpressionAttributeValueMap;
  export type AttributeValueVar = ExpressionAttributeValueVariable;
  export type AttributeNameVar = ExpressionAttributeNameVariable;
  export type AttributeName = ExpressionAttributeNameMap;
  export type UpdateExpression = updateExpression;
  export type BatchGetInput = DynamoDocClient.BatchGetItemInput;
  export type BatchGetOutput = Promise<DynamoDocClient.BatchGetItemOutput>;
}

export interface DynamoExpressionObject {
  UpdateExpression: Dynamo.UpdateExpression;
  ExpressionAttributeNames?: Dynamo.AttributeName;
  ExpressionAttributeValues: Dynamo.AttributeValue;
}

export interface DynamoExpressionObjectWithFlat extends DynamoExpressionObject {
  flatObject: any;
}
export type DynamoExpression = (flat: object) => DynamoExpressionObject;

export type GetDynamoExpressionWithFlat = (flatObject: object) => DynamoExpressionObjectWithFlat;
