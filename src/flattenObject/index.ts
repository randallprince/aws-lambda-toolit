/* eslint-disable no-param-reassign */
import flatten from 'flat';
import { isDate, transform } from 'lodash';

/**
 * This function is flattening any object to the next format:
 * it calls toISOString for every Date in the object
 * the nested objects are separated by dot (.) and
 * the nested arrays are in the square brackets []
 * BEWARE: if you use numbers in your objects it will
 * be considered array
 */
export const flattenObject = (obj: any): any => {
  // Flat the array with flat package
  const flatObj: any = flatten(obj);

  // Do additional transformations
  return transform(
    flatObj,
    (result: any, value: any, key: string) => {
      // We enclose all the keys that contain numbers with brackets while deleting the separating dot
      const newKey = key.replace(/(\.)(\d)/gi, '[$2]');
      // We check if the value is Date and if it is we transform it the string with toISOString() call
      const newValue = isDate(value) ? (value as Date).toISOString() : value;
      // Adding keys and values to accummulator
      result[newKey] = newValue;
      // Returning the accumulator
      return result;
    },
    {},
  );
};
