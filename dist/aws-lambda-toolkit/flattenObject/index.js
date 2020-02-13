"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-param-reassign */
const flat_1 = __importDefault(require("flat"));
const lodash_1 = require("lodash");
/**
 * This function is flattening any object to the next format:
 * it calls toISOString for every Date in the object
 * the nested objects are separated by dot (.) and
 * the nested arrays are in the square brackets []
 * BEWARE: if you use numbers in your objects it will
 * be considered array
 */
exports.flattenObject = (obj) => {
    // Flat the array with flat package
    const flatObj = flat_1.default(obj);
    // Do additional transformations
    return lodash_1.transform(flatObj, (result, value, key) => {
        // We enclose all the keys that contain numbers with brackets while deleting the separating dot
        const newKey = key.replace(/(\.)(\d)/gi, '[$2]');
        // We check if the value is Date and if it is we transform it the string with toISOString() call
        const newValue = lodash_1.isDate(value) ? value.toISOString() : value;
        // Adding keys and values to accummulator
        result[newKey] = newValue;
        // Returning the accumulator
        return result;
    }, {});
};
