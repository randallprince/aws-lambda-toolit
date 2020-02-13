export interface JoiObject {
    isJoi: boolean;
}
export interface Context {
    [key: string]: any;
    key?: string;
    label?: string;
    value?: any;
}
export interface ValidationErrorItem {
    message: string;
    path: Array<string | number>;
    type: string;
    context?: Context;
}
export interface JoiValidationError extends Error, JoiObject {
    name: 'ValidationError';
    /**
     * array of errors.
     */
    details: ValidationErrorItem[];
    _object: any;
    /**
     * function that returns a string with an annotated version of the
     * object pointing at the places where errors occurred.
     * @param stripColors - if truthy, will strip the colors out of the output.
     */
    annotate(stripColors?: boolean): string;
}
export interface ValidationProperty {
    property: string;
}
export interface ValidationError {
    code: string;
    message: string;
    properties: ValidationProperty[];
}
export interface FormatValidationErrors {
    (errors: JoiValidationError): {
        errors: ValidationError[];
    };
}
export declare class JoiSchemaValidationError implements ValidationError {
    code: string;
    message: string;
    properties: Array<{
        property: string;
    }>;
    constructor({ code, message, properties }: ValidationError);
}
export declare const formatValidationErrors: FormatValidationErrors;
