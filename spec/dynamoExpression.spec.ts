import { DynamoExpression } from '../src/interfaces';
import { flattenObject } from '../src/flattenObject';
import { dynamoExpression } from '../src/dynamoExpression';

const getDynamoExpression: DynamoExpression = object => {
  const flatObject = flattenObject(object);
  const expression = dynamoExpression(flatObject);
  return { ...expression, flatObject };
};

describe('testing flat function', () => {
  describe('sucessful invocations', () => {
    it('flattens the object with no nesting', async () => {
      expect.assertions(3);
      const objectToFlat = {
        hi: 'hello',
        number: 0,
        boolean: true,
      };
      const { ExpressionAttributeValues, ExpressionAttributeNames, UpdateExpression } = getDynamoExpression(
        objectToFlat,
      );
      expect(ExpressionAttributeNames).toStrictEqual({ '#boolean': 'boolean', '#hi': 'hi', '#number': 'number' });
      expect(ExpressionAttributeValues).toStrictEqual({
        ':booleanValue': true,
        ':hiValue': 'hello',
        ':numberValue': 0,
      });
      expect(UpdateExpression).toBe(`SET #hi = :hiValue, #number = :numberValue, #boolean = :booleanValue`);
    });

    // it('flattens the object with no nesting', async () => {
    //   expect.assertions(3);
    //   const objectToFlat = {
    //     source: {
    //       source: 'me',
    //       sourceId: '1234',
    //       sourceUser: 'you',
    //     },
    //     usageType: 'LEASE',
    //     status: 'ELIGIBLE',
    //   };
    //   const { ExpressionAttributeValues, ExpressionAttributeNames, UpdateExpression } = getDynamoExpression(
    //     objectToFlat,
    //   );
    //   expect(ExpressionAttributeNames).toStrictEqual({ '#boolean': 'boolean', '#hi': 'hi', '#number': 'number' });
    //   expect(ExpressionAttributeValues).toStrictEqual({
    //     ':booleanValue': true,
    //     ':hiValue': 'hello',
    //     ':numberValue': 0,
    //   });
    //   expect(UpdateExpression).toBe(`SET #hi = :hiValue, #number = :numberValue, #boolean = :booleanValue`);
    // });

    it('flattens the object with no nesting', async () => {
      expect.assertions(3);
      const date = new Date();
      const objectToFlat = {
        hi: 'swt',
        hello: { hi: 'hi', bye: 'bye' },
        array: [{ hello: ['hi'] }],
        train: [[[['cho-cho']]]],
        object: { objectinObject: { ccomboObject: date } },
      };
      const { ExpressionAttributeValues, ExpressionAttributeNames, UpdateExpression } = getDynamoExpression(
        objectToFlat,
      );
      expect(ExpressionAttributeNames).toStrictEqual({
        '#hi': 'hi',
        '#hello': 'hello',
        '#bye': 'bye',
        '#array': 'array',
        '#train': 'train',
        '#object': 'object',
        '#objectinObject': 'objectinObject',
        '#ccomboObject': 'ccomboObject',
      });
      expect(ExpressionAttributeValues).toStrictEqual({
        ':hiValue': 'swt',
        ':hellohiValue': 'hi',
        ':hellobyeValue': 'bye',
        ':array0hello0Value': 'hi',
        ':train0000Value': 'cho-cho',
        ':objectobjectinObjectccomboObjectValue': date.toISOString(),
      });
      expect(UpdateExpression).toBe(
        'SET #hi = :hiValue, #hello.#hi = :hellohiValue, #hello.#bye = :hellobyeValue,' +
          ' #array[0].#hello[0] = :array0hello0Value, #train[0][0][0][0] = :train0000Value,' +
          ' #object.#objectinObject.#ccomboObject = :objectobjectinObjectccomboObjectValue',
      );
    });
  });
});
