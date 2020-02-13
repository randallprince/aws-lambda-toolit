"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-bitwise */
/* eslint-disable no-case-declarations */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-underscore-dangle */
const assert_1 = require("assert");
const lodash_1 = require("lodash");
exports.convert = (joi) => {
    assert_1.strict(joi.type, 'joi schema object must have a type');
    if (joi.type && !TYPES[joi.type]) {
        throw new Error(`sorry, do not know how to convert unknown joi type: "${joi.type}"`);
    }
    const schema = {};
    if (joi._flags && !lodash_1.isNil(joi._flags.description)) {
        schema.description = joi._flags.description;
    }
    if (joi._flags && !lodash_1.isNil(joi._flags.default)) {
        schema.default = joi._flags.default;
    }
    if (joi.keys && typeof joi.keys === 'function') {
        joi = joi.describe();
    }
    else if (joi.describe) {
        try {
            joi = joi.describe();
        }
        catch (e) {
            console.warn(e);
        }
    }
    const result = TYPES[joi.type](schema, joi);
    return result;
};
const checkForCommonFlags = (schema, joi) => {
    var _a, _b, _c, _d, _e, _f;
    if (((_b = (_a = joi) === null || _a === void 0 ? void 0 : _a.flags) === null || _b === void 0 ? void 0 : _b.default) != null) {
        schema.default = joi.flags.default;
    }
    if (((_d = (_c = joi) === null || _c === void 0 ? void 0 : _c.flags) === null || _d === void 0 ? void 0 : _d.presence) === 'forbidden') {
        schema.forbidden = true;
    }
    if (((_f = (_e = joi) === null || _e === void 0 ? void 0 : _e.flags) === null || _f === void 0 ? void 0 : _f.label) != null) {
        schema.label = joi.flags.label;
    }
    if (joi.allow && joi.type !== ('any' || 'object')) {
        if (joi.allow.includes(null)) {
            joi.allow = lodash_1.filter(joi.allow, item => item !== null);
            schema.type = Array.isArray(schema.type) ? [...schema.type, 'null'] : [schema.type, 'null'];
        }
        if (!lodash_1.isEmpty(joi.allow)) {
            schema.enum = joi.allow;
        }
    }
    if (joi.examples) {
        schema.examples = joi.examples;
    }
    return schema;
};
let TYPES = {
    alternatives: (schema, joi) => {
        if (joi.matches) {
            schema.oneOf = [];
            lodash_1.map(joi.matches, (item) => {
                if (item.schema && schema.oneOf) {
                    schema.oneOf.push(exports.convert(item.schema));
                }
                else if (item.then && schema.oneOf) {
                    schema.oneOf.push(exports.convert(item.then));
                }
                if (item.otherwise && schema.oneOf) {
                    schema.oneOf.push(exports.convert(item.otherwise));
                }
            });
        }
        return schema;
    },
    any: (schema, joi) => {
        schema.type = ['array', 'boolean', 'number', 'object', 'string', 'null'];
        checkForCommonFlags(schema, joi);
        if (joi.allow) {
            if (joi.allow.includes(null)) {
                joi.allow = lodash_1.filter(joi.allow, item => item !== null);
            }
            return {
                ...schema,
                anyOf: lodash_1.isEmpty(joi.allow)
                    ? [
                        {
                            type: joi.type,
                        },
                    ]
                    : [
                        {
                            type: joi.type,
                            enum: joi.allow,
                        },
                    ],
            };
        }
        return schema;
    },
    array: (schema, joi) => {
        schema.type = 'array';
        checkForCommonFlags(schema, joi);
        if (joi.items) {
            lodash_1.map(joi.items, (item) => {
                schema.items = exports.convert(item);
            });
        }
        if (joi.ordered) {
            schema.ordered = [];
            lodash_1.map(joi.ordered, (item) => {
                if (schema.ordered) {
                    schema.ordered.push(exports.convert(item));
                }
            });
        }
        if (joi.rules) {
            lodash_1.map(joi.rules, rule => {
                switch (rule.name) {
                    case 'min':
                        schema.minItems = lodash_1.get(rule, 'args.limit');
                        break;
                    case 'max':
                        schema.maxItems = lodash_1.get(rule, 'args.limit');
                        break;
                    case 'length':
                        schema.minItems = lodash_1.get(rule, 'args.limit');
                        schema.maxItems = lodash_1.get(rule, 'args.limit');
                        break;
                    default:
                        schema.format = rule.name || [];
                }
            });
        }
        return schema;
    },
    binary: (schema, joi) => {
        schema.type = 'string';
        checkForCommonFlags(schema, joi);
        schema.contentMediaType =
            joi.metas && joi.metas.length > 0 && joi.metas[0].contentMediaType ? joi.metas[0].contentMediaType : 'text/plain';
        schema.contentEncoding = joi.flags && joi.flags.encoding ? joi.flags.encoding : 'binary';
        return schema;
    },
    boolean: (schema, joi) => {
        schema.type = 'boolean';
        checkForCommonFlags(schema, joi);
        return schema;
    },
    date: (schema, joi) => {
        schema.type = 'string';
        checkForCommonFlags(schema, joi);
        if (joi.rules) {
            lodash_1.map(joi.rules, rule => {
                switch (rule.name) {
                    case 'min':
                        schema.minimum = lodash_1.get(rule, 'args.date');
                        break;
                    case 'max':
                        schema.maximum = lodash_1.get(rule, 'args.date');
                        break;
                    default:
                        break;
                }
            });
        }
        else if (joi.flags && joi.flags.format) {
            lodash_1.map(joi.flags, flag => {
                schema.format = flag;
            });
        }
        else {
            schema.format = 'date-time';
        }
        return schema;
    },
    function: (schema, joi) => {
        schema.type = 'function';
        checkForCommonFlags(schema, joi);
        return schema;
    },
    link: (schema, joi) => {
        schema.type = 'link';
        checkForCommonFlags(schema, joi);
        if (joi.link) {
            lodash_1.map(joi.link, link => {
                if (!lodash_1.isEmpty(link.path)) {
                    schema.path = link.path;
                }
                if (!lodash_1.isEmpty(link.ancestor)) {
                    schema.ancestor = link.ancestor;
                }
            });
        }
        return schema;
    },
    number: (schema, joi) => {
        schema.type = 'number';
        checkForCommonFlags(schema, joi);
        if (joi.rules) {
            lodash_1.map(joi.rules, rule => {
                if (rule.name) {
                    switch (rule.name) {
                        case 'integer':
                            schema.type = 'integer';
                            break;
                        case 'less':
                            schema.exclusiveMaximum = true;
                            schema.maximum = lodash_1.get(rule, 'args.limit');
                            break;
                        case 'greater':
                            schema.exclusiveMinimum = true;
                            schema.minimum = lodash_1.get(rule, 'args.limit');
                            break;
                        case 'min':
                            schema.minimum = lodash_1.get(rule, 'args.limit');
                            break;
                        case 'max':
                            schema.maximum = lodash_1.get(rule, 'args.limit');
                            break;
                        case 'precision':
                            schema.precision = lodash_1.get(rule, 'args.limit');
                            break;
                        case 'multiple':
                            schema.multiple = lodash_1.get(rule, 'args.base');
                            break;
                        default:
                            break;
                    }
                }
            });
        }
        return schema;
    },
    object: (schema, joi) => {
        var _a, _b;
        schema.type = 'object';
        schema.properties = {};
        checkForCommonFlags(schema, joi);
        schema.additionalProperties = Boolean(joi.flags && joi.flags.unknown);
        if (((_b = (_a = joi) === null || _a === void 0 ? void 0 : _a.flags) === null || _b === void 0 ? void 0 : _b.presence) === 'forbidden') {
            schema.forbidden = true;
        }
        if (joi.allow) {
            lodash_1.map(joi.allow, item => {
                if (item.value) {
                    if (lodash_1.includes(item.value, null)) {
                        item.value = lodash_1.pickBy(item.value, itemValue => itemValue !== null);
                        schema.type = Array.isArray(schema.type) ? [...schema.type, 'null'] : [schema.type, 'null'];
                    }
                    if (!lodash_1.isEmpty(item.value)) {
                        schema.enum = item.value;
                    }
                }
            });
        }
        if (joi.keys) {
            lodash_1.map(joi.keys, (item, itemIndex) => {
                schema.properties[itemIndex] = lodash_1.omit(joi.keys[itemIndex], 'keys', 'flags');
                if (item.flags && item.flags.presence === 'required') {
                    schema.required = [];
                    schema.required.push(itemIndex);
                }
                schema.properties[itemIndex] = exports.convert(item);
            });
        }
        return schema;
    },
    string: (schema, joi) => {
        var _a, _b;
        schema.type = 'string';
        checkForCommonFlags(schema, joi);
        if (((_b = (_a = joi) === null || _a === void 0 ? void 0 : _a.flags) === null || _b === void 0 ? void 0 : _b.insensitive) != null) {
            schema.insensitive = joi.flags.insensitive;
        }
        if (joi.rules) {
            lodash_1.map(joi.rules, rule => {
                switch (rule.name) {
                    case 'email':
                        schema.format = 'email';
                        break;
                    case 'pattern':
                        const pattern = lodash_1.get(rule, 'args.regex');
                        schema.pattern = String(pattern)
                            .replace(/^\//, '')
                            .replace(/\/$/, '');
                        if (rule.args.options) {
                            schema.format = rule.args.options.name;
                        }
                        break;
                    case 'min':
                        schema.minLength = lodash_1.get(rule, 'args.limit');
                        break;
                    case 'max':
                        schema.maxLength = lodash_1.get(rule, 'args.limit');
                        break;
                    case 'length':
                        schema.minLength = lodash_1.get(rule, 'args.limit');
                        schema.maxLength = lodash_1.get(rule, 'args.limit');
                        break;
                    case 'uri':
                        schema.format = 'uri';
                        break;
                    default:
                        schema.format = rule.name || [];
                }
            });
        }
        return schema;
    },
    symbol: (schema, joi) => {
        schema.type = 'symbol';
        checkForCommonFlags(schema, joi);
        return schema;
    },
};
/**
 * Converts the supplied joi validation object into a JSON schema object,
 * optionally applying a transformation.
 *
 * @param {JoiValidation} joi
 * @returns {JSONSchema}
 */
exports.convert.TYPES = TYPES;
/**
 * Joi Validation Object
 * @typedef {object} JoiValidation
 */
/**
 * JSON Schema Object
 * @typedef {object} JSONSchema
 */
