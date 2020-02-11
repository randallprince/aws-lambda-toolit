import { flattenObject as flat } from '../src/flattenObject';

describe('testing flat function', () => {
  describe('sucessful invocations', () => {
    it('flattens the object with no nesting', async () => {
      expect.assertions(1);
      const objectToFlat = {
        hi: 'hello',
        number: 0,
        boolean: true,
      };
      const flatObject = flat(objectToFlat);
      expect(objectToFlat).toStrictEqual(flatObject);
    });

    it('flattens the object with dates', async () => {
      expect.assertions(1);
      const objectToFlat = {
        date: new Date(),
      };
      const flatObject = flat(objectToFlat);
      expect(objectToFlat.date.toISOString()).toEqual(flatObject.date);
    });

    it('flattens the array with dates', async () => {
      expect.assertions(4);
      const objectToFlat: [Date, string, boolean, number] = [new Date(), 'hello', false, 0];
      const flatObject = flat(objectToFlat);
      expect(objectToFlat[0].toISOString()).toEqual(flatObject[0]);
      expect(objectToFlat[1]).toEqual(flatObject[1]);
      expect(objectToFlat[2]).toEqual(flatObject[2]);
      expect(objectToFlat[3]).toEqual(flatObject[3]);
    });

    it('flattens the array of array', async () => {
      expect.assertions(5);
      const objectToFlat: any[][] | any[] = [['hello', false], 0];
      const flatObject = flat(objectToFlat);
      expect(objectToFlat[0][0]).toEqual(flatObject['0[0]']);
      expect(objectToFlat[0][1]).toEqual(flatObject['0[1]']);
      expect(objectToFlat[1]).toEqual(flatObject[1]);
      expect(flatObject instanceof Object).toBe(true);
      expect(objectToFlat instanceof Array).toBe(true);
    });

    it('flattens the deeply nested object', async () => {
      expect.assertions(1);
      const date = new Date();
      const objectToFlat = {
        hi: 'swt',
        hello: { hi: 'hi' },
        array: [{ hello: ['hi'] }],
        train: [[[['cho-cho']]]],
        object: { objectinObject: { ccomboObject: date } },
      };
      const flatObject = flat(objectToFlat);
      expect(flatObject).toStrictEqual({
        hi: 'swt',
        'hello.hi': 'hi',
        'array[0].hello[0]': 'hi',
        'train[0][0][0][0]': 'cho-cho',
        'object.objectinObject.ccomboObject': date.toISOString(),
      });
    });
  });
});
