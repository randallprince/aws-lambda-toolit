import { GetDynamoExpressionWithFlat, DynamoExpression } from '../interfaces';
/**
 * This function generates UpdateExpression, ExpressionAttributeValues
 * and ExpressionAttributeNames from the flat object you pass in
 */
export declare const dynamoExpression: DynamoExpression;
/**
 * This function generates UpdateExpression, ExpressionAttributeValues
 * and ExpressionAttributeNames and flatObject from the object you pass in
 */
export declare const getDynamoExpressionWithFlat: GetDynamoExpressionWithFlat;
