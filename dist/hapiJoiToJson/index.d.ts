/// <reference types="hapi__joi" />
import { AnySchema } from '@hapi/joi';
interface JoiSchema {
    allow?: any;
    examples?: any;
    flags?: any;
    items?: JoiSchema;
    keys: Properties;
    link?: any;
    matches?: any;
    metas?: any;
    ordered?: JoiSchema[];
    rules?: any;
    type: string;
}
interface Properties {
    [itemIndex: string]: {
        properties?: Properties;
    };
}
export declare const convert: {
    (joi: JoiSchema | AnySchema): any;
    /**
     * Converts the supplied joi validation object into a JSON schema object,
     * optionally applying a transformation.
     *
     * @param {JoiValidation} joi
     * @returns {JSONSchema}
     */
    TYPES: any;
};
export {};
/**
 * Joi Validation Object
 * @typedef {object} JoiValidation
 */
/**
 * JSON Schema Object
 * @typedef {object} JSONSchema
 */
