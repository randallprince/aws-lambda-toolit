/**
 * This function is flattening any object to the next format:
 * it calls toISOString for every Date in the object
 * the nested objects are separated by dot (.) and
 * the nested arrays are in the square brackets []
 * BEWARE: if you use numbers in your objects it will
 * be considered array
 */
export declare const flattenObject: (obj: any) => any;
