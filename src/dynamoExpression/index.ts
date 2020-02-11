import { transform } from 'lodash';
import { DynamoExpressionObject, GetDynamoExpressionWithFlat, DynamoExpression } from '../interfaces';
import { flattenObject } from '../flattenObject';

/**
 * This function generates UpdateExpression, ExpressionAttributeValues
 * and ExpressionAttributeNames from the flat object you pass in
 */
export const dynamoExpression: DynamoExpression = flatObject => {
  // We initialize the object
  const result = transform(flatObject, (res: DynamoExpressionObject, val: any, key: string) => {
    // If res.UpdateExpression doesn't exist we supply it with default value
    if (!res.UpdateExpression) {
      res.UpdateExpression = 'SET ';
    }
    // Replace the attribute name with #
    const expressionAttrName = `#${key.replace(/(\.)|((\[)|(\]))/gi, '')}`;
    // Replace the attribute value with : and add Value to the end (so it won't conflict with dynamo reserved keywords)
    const expressionAttrValue = `:${key.replace(/(\.)|((\[)|(\]))/gi, '')}Value`;
    // Add attribute name and value to update expression
    let UpdateExpression = `${expressionAttrName} = ${expressionAttrValue}, `;

    // Generate ExpressionAttributeNames
    let ExpressionAttributeNames = {} as any;
    const ExpressionAttributeValues = { [expressionAttrValue]: val };

    // If it's an array or object
    if (key.includes('.') || key.includes('[')) {
      // We map the keys here
      // eslint-disable-next-line array-callback-return
      key.split('.').map((item, i) => {
        ExpressionAttributeNames[`#${item.replace(/((\[)[0-9](\]))/gi, '')}`] = key
          .split('.')
          [i].replace(/((\[)[0-9](\]))/gi, '');
      });
      // Valid updateExpression with proper nesting
      UpdateExpression = `#${key.replace(/(\.)/gi, '.#')} = ${expressionAttrValue}, `;
      // We don't add duplicate keys here
      if (res.UpdateExpression.includes(UpdateExpression)) {
        UpdateExpression = ``;
      }
      // It's a primitive so mapping is easy
    } else {
      ExpressionAttributeNames = { [expressionAttrName]: key };
    }
    // Return values
    res.UpdateExpression += UpdateExpression;
    res.ExpressionAttributeValues = { ...res.ExpressionAttributeValues, ...ExpressionAttributeValues };
    res.ExpressionAttributeNames = { ...res.ExpressionAttributeNames, ...ExpressionAttributeNames };
    return res;
  });
  // Remove last 2 symbols (it would be an ", ")
  result.UpdateExpression = result.UpdateExpression.slice(0, -2);
  return result;
};

/**
 * This function generates UpdateExpression, ExpressionAttributeValues
 * and ExpressionAttributeNames and flatObject from the object you pass in
 */
export const getDynamoExpressionWithFlat: GetDynamoExpressionWithFlat = object => {
  const flatObject = flattenObject(object);
  const expression = dynamoExpression(flatObject);
  return { ...expression, flatObject };
};
