/* eslint-disable no-bitwise */
/* eslint-disable no-case-declarations */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-underscore-dangle */
import { strict as assert } from 'assert';
import { map, omit, isNil, get, isEmpty, filter, includes, pickBy } from 'lodash';
import { ObjectSchema, AnySchema } from '@hapi/joi';

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
interface OneOf {
  enum?: string[];
  type: string;
}

interface RootSchema {
  additionalProperties?: boolean;
  ancestor?: string;
  contentMediaType?: any;
  contentEncoding?: any;
  default?: string;
  description?: string;
  enum?: string[];
  examples?: any;
  exclusiveMaximum?: boolean;
  exclusiveMinimum?: boolean;
  format?: string;
  forbidden?: boolean;
  items: JoiSchema;
  insensitive?: boolean;
  label?: string;
  maximum?: number;
  maxItems?: number;
  maxLength?: number;
  minimum?: number;
  minItems?: number;
  minLength?: number;
  multiple?: number;
  oneOf?: string[] | OneOf[];
  ordered?: JoiSchema[];
  path?: string;
  pattern?: string;
  patterns?: string[];
  properties: Properties;
  precision?: number;
  required?: string[];
  type: string | string[];
}

interface Properties {
  [itemIndex: string]: {
    properties?: Properties;
  };
}

export const convert = (joi: AnySchema | JoiSchema) => {
  assert((joi as ObjectSchema).type, 'joi schema object must have a type');
  if ((joi as ObjectSchema).type && !TYPES[joi.type as any]) {
    throw new Error(`sorry, do not know how to convert unknown joi type: "${(joi as ObjectSchema).type}"`);
  }

  const schema = {} as RootSchema;

  if ((joi as ObjectSchema)._flags && !isNil((joi as ObjectSchema)._flags.description)) {
    schema.description = (joi as ObjectSchema)._flags.description;
  }

  if ((joi as ObjectSchema)._flags && !isNil((joi as ObjectSchema)._flags.default)) {
    schema.default = (joi as ObjectSchema)._flags.default;
  }

  if ((joi as ObjectSchema).keys && typeof (joi as ObjectSchema).keys === 'function') {
    joi = (joi as ObjectSchema).describe() as JoiSchema;
  } else if ((joi as ObjectSchema).describe) {
    try {
      joi = (joi as ObjectSchema).describe() as JoiSchema;
    } catch (e) {
      console.warn(e);
    }
  }

  const result = TYPES[joi.type!](schema, joi);

  return result;
};

const checkForCommonFlags = (schema: RootSchema, joi: JoiSchema): RootSchema => {
  if (joi?.flags?.default != null) {
    schema.default = joi.flags.default;
  }
  if (joi?.flags?.presence === 'forbidden') {
    schema.forbidden = true;
  }
  if (joi?.flags?.label != null) {
    schema.label = joi.flags.label;
  }
  if (joi.allow && joi.type !== ('any' || 'object')) {
    if (joi.allow.includes(null)) {
      joi.allow = filter(joi.allow, item => item !== null);
      schema.type = Array.isArray(schema.type) ? [...schema.type, 'null'] : [schema.type, 'null'];
    }
    if (!isEmpty(joi.allow)) {
      schema.enum = joi.allow;
    }
  }
  if (joi.examples) {
    schema.examples = joi.examples;
  }
  return schema;
};

let TYPES: any = {
  alternatives: (schema: RootSchema, joi: JoiSchema) => {
    if (joi.matches) {
      schema.oneOf = [];
      map(joi.matches, (item: any) => {
        if (item.schema && schema.oneOf) {
          schema.oneOf.push(convert(item.schema));
        } else if (item.then && schema.oneOf) {
          schema.oneOf.push(convert(item.then));
        }
        if (item.otherwise && schema.oneOf) {
          schema.oneOf.push(convert(item.otherwise));
        }
      });
    }
    return schema;
  },

  any: (schema: RootSchema, joi: JoiSchema) => {
    schema.type = ['array', 'boolean', 'number', 'object', 'string', 'null'];
    checkForCommonFlags(schema, joi);
    if (joi.allow) {
      if (joi.allow.includes(null)) {
        joi.allow = filter(joi.allow, item => item !== null);
      }
      return {
        ...schema,
        anyOf: isEmpty(joi.allow)
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

  array: (schema: RootSchema, joi: JoiSchema) => {
    schema.type = 'array';
    checkForCommonFlags(schema, joi);
    if (joi.items) {
      map(joi.items, (item: any) => {
        schema.items = convert(item);
      });
    }
    if (joi.ordered) {
      schema.ordered = [];
      map(joi.ordered, (item: any) => {
        if (schema.ordered) {
          schema.ordered.push(convert(item));
        }
      });
    }
    if (joi.rules) {
      map(joi.rules, rule => {
        switch (rule.name) {
          case 'min':
            schema.minItems = get(rule, 'args.limit');
            break;
          case 'max':
            schema.maxItems = get(rule, 'args.limit');
            break;
          case 'length':
            schema.minItems = get(rule, 'args.limit');
            schema.maxItems = get(rule, 'args.limit');
            break;
          default:
            schema.format = rule.name || [];
        }
      });
    }

    return schema;
  },

  binary: (schema: RootSchema, joi: JoiSchema) => {
    schema.type = 'string';
    checkForCommonFlags(schema, joi);
    schema.contentMediaType =
      joi.metas && joi.metas.length > 0 && joi.metas[0].contentMediaType ? joi.metas[0].contentMediaType : 'text/plain';
    schema.contentEncoding = joi.flags && joi.flags.encoding ? joi.flags.encoding : 'binary';

    return schema;
  },

  boolean: (schema: RootSchema, joi: JoiSchema) => {
    schema.type = 'boolean';
    checkForCommonFlags(schema, joi);
    return schema;
  },

  date: (schema: RootSchema, joi: JoiSchema) => {
    schema.type = 'string';
    checkForCommonFlags(schema, joi);
    if (joi.rules) {
      map(joi.rules, rule => {
        switch (rule.name) {
          case 'min':
            schema.minimum = get(rule, 'args.date');
            break;
          case 'max':
            schema.maximum = get(rule, 'args.date');
            break;
          default:
            break;
        }
      });
    } else if (joi.flags && joi.flags.format) {
      map(joi.flags, flag => {
        schema.format = flag;
      });
    } else {
      schema.format = 'date-time';
    }
    return schema;
  },

  function: (schema: RootSchema, joi: JoiSchema) => {
    schema.type = 'function';
    checkForCommonFlags(schema, joi);
    return schema;
  },

  link: (schema: RootSchema, joi: JoiSchema) => {
    schema.type = 'link';
    checkForCommonFlags(schema, joi);
    if (joi.link) {
      map(joi.link, link => {
        if (!isEmpty(link.path)) {
          schema.path = link.path;
        }
        if (!isEmpty(link.ancestor)) {
          schema.ancestor = link.ancestor;
        }
      });
    }

    return schema;
  },

  number: (schema: RootSchema, joi: JoiSchema) => {
    schema.type = 'number';
    checkForCommonFlags(schema, joi);
    if (joi.rules) {
      map(joi.rules, rule => {
        if (rule.name) {
          switch (rule.name) {
            case 'integer':
              schema.type = 'integer';
              break;
            case 'less':
              schema.exclusiveMaximum = true;
              schema.maximum = get(rule, 'args.limit');
              break;
            case 'greater':
              schema.exclusiveMinimum = true;
              schema.minimum = get(rule, 'args.limit');
              break;
            case 'min':
              schema.minimum = get(rule, 'args.limit');
              break;
            case 'max':
              schema.maximum = get(rule, 'args.limit');
              break;
            case 'precision':
              schema.precision = get(rule, 'args.limit');
              break;
            case 'multiple':
              schema.multiple = get(rule, 'args.base');
              break;
            default:
              break;
          }
        }
      });
    }
    return schema;
  },

  object: (schema: RootSchema, joi: JoiSchema) => {
    schema.type = 'object';
    schema.properties = {};
    checkForCommonFlags(schema, joi);
    schema.additionalProperties = Boolean(joi.flags && joi.flags.unknown);
    if (joi?.flags?.presence === 'forbidden') {
      schema.forbidden = true;
    }
    if (joi.allow) {
      map(joi.allow, item => {
        if (item.value) {
          if (includes(item.value, null)) {
            item.value = pickBy(item.value, itemValue => itemValue !== null);
            schema.type = Array.isArray(schema.type) ? [...schema.type, 'null'] : [schema.type, 'null'];
          }
          if (!isEmpty(item.value)) {
            schema.enum = item.value;
          }
        }
      });
    }
    if (joi.keys) {
      map(joi.keys, (item: any, itemIndex: string) => {
        schema.properties[itemIndex] = omit(joi.keys[itemIndex], 'keys', 'flags');
        if (item.flags && item.flags.presence === 'required') {
          schema.required = [];
          schema.required.push(itemIndex);
        }
        schema.properties[itemIndex] = convert(item);
      });
    }
    return schema;
  },

  string: (schema: RootSchema, joi: JoiSchema) => {
    schema.type = 'string';
    checkForCommonFlags(schema, joi);
    if (joi?.flags?.insensitive != null) {
      schema.insensitive = joi.flags.insensitive;
    }
    if (joi.rules) {
      map(joi.rules, rule => {
        switch (rule.name) {
          case 'email':
            schema.format = 'email';
            break;
          case 'pattern':
            const pattern = get(rule, 'args.regex');
            schema.pattern = String(pattern)
              .replace(/^\//, '')
              .replace(/\/$/, '');
            if (rule.args.options) {
              schema.format = rule.args.options.name;
            }
            break;
          case 'min':
            schema.minLength = get(rule, 'args.limit');
            break;
          case 'max':
            schema.maxLength = get(rule, 'args.limit');
            break;
          case 'length':
            schema.minLength = get(rule, 'args.limit');
            schema.maxLength = get(rule, 'args.limit');
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

  symbol: (schema: RootSchema, joi: JoiSchema) => {
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

convert.TYPES = TYPES;

/**
 * Joi Validation Object
 * @typedef {object} JoiValidation
 */
/**
 * JSON Schema Object
 * @typedef {object} JSONSchema
 */
