// @formatter:off
import Joi, { AnySchema } from '@hapi/joi';
import { convert } from '../src';

// @formatter:on
/**
 * Throws if schema !== expected or if schema fails to jsonSchema.validate()
 * @param {object} schema
 * @param {object} expected
 */

describe('testing convert function', () => {
  describe('invalid cases', () => {
    it('missed joi type', async () => {
      const joi = { incorrectData: '' } as any;
      try {
        convert(joi);
      } catch (error) {
        expect(error).toMatchObject({ message: 'joi schema object must have a type' });
      }
    });
    it('unknown joi type', async () => {
      const joi = { type: 'invalid' } as AnySchema;
      try {
        convert(joi);
      } catch (error) {
        expect(error).toStrictEqual(new Error('sorry, do not know how to convert unknown joi type: "invalid"'));
      }
    });
  });

  describe('correct cases', () => {
    it('object defaults', () => {
      const joi = Joi.object();
      const schema = convert(joi);
      const expected = {
        type: 'object',
        properties: {},
        additionalProperties: false,
      };
      expect(schema).toEqual(expected);
    });
    it('empty object will not allow additional properties', () => {
      const joi = Joi.object({});
      const schema = convert(joi);
      const expected = {
        type: 'object',
        properties: {},
        additionalProperties: false,
      };
      expect(schema).toEqual(expected);
    });
    it('object label', () => {
      const joi = Joi.object().label('Title');
      const schema = convert(joi);
      const expected = {
        type: 'object',
        label: 'Title',
        properties: {},
        additionalProperties: false,
      };
      expect(schema).toEqual(expected);
    });
    it('object description', () => {
      const joi = Joi.object().description('woot');
      const schema = convert(joi);
      const expected = {
        type: 'object',
        properties: {},
        additionalProperties: false,
        description: 'woot',
      };
      expect(schema).toEqual(expected);
    });
    it('object example', () => {
      const joi = Joi.object().example({ key: 'value' });
      const schema = convert(joi);
      const expected = {
        type: 'object',
        properties: {},
        additionalProperties: false,
        examples: [{ key: 'value' }],
      };
      expect(schema).toEqual(expected);
    });
    it('object without unknown keys', () => {
      const joi = Joi.object().unknown(false);
      const schema = convert(joi);
      const expected = {
        type: 'object',
        properties: {},
        additionalProperties: false,
      };
      expect(schema).toEqual(expected);
    });
    it('object allow unknown', () => {
      const joi = Joi.object().unknown(true);
      const schema = convert(joi);
      const expected = {
        type: 'object',
        properties: {},
        additionalProperties: true,
      };
      expect(schema).toEqual(expected);
    });
    it('object forbidden', () => {
      const joi = Joi.object().forbidden();
      const schema = convert(joi);
      const expected = {
        type: 'object',
        properties: {},
        forbidden: true,
        additionalProperties: false,
      };
      expect(schema).toEqual(expected);
    });
    it('object allow', () => {
      const joi = Joi.object().allow({ a: 'a' });
      const schema = convert(joi);
      const expected = {
        type: 'object',
        properties: {},
        enum: { a: 'a' },
        additionalProperties: false,
      };
      expect(schema).toEqual(expected);
    });
    it('object allow with null', () => {
      const joi = Joi.object().allow({ a: 'a', b: null });
      const schema = convert(joi);
      const expected = {
        type: ['object', 'null'],
        properties: {},
        enum: { a: 'a' },
        additionalProperties: false,
      };
      expect(schema).toEqual(expected);
    });
    it('object', () => {
      const joi = Joi.object().keys({
        string: Joi.string(),
        'string default': Joi.string()
          .default('bar')
          .description('bar desc'),
        number: Joi.number(),
        boolean: Joi.boolean(),
      });
      const schema = convert(joi);
      const expected = {
        type: 'object',
        properties: {
          string: {
            type: 'string',
          },
          'string default': {
            type: 'string',
            default: 'bar',
          },
          number: {
            type: 'number',
          },
          boolean: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      };
      expect(schema).toEqual(expected);
    });
    it('object property required', () => {
      const joi = Joi.object().keys({
        string: Joi.string(),
        'string default': Joi.string().default('bar'),
        number: Joi.number(),
        enumWithNull: Joi.string()
          .valid(null, 'some', 'different', 'value')
          .optional(),
        'boolean required': Joi.boolean().required(),
        'boolean optional null': Joi.boolean()
          .allow(null)
          .optional(),
      });
      const schema = convert(joi);
      const expected = {
        type: 'object',
        required: ['boolean required'],
        properties: {
          string: {
            type: 'string',
          },
          'string default': {
            type: 'string',
            default: 'bar',
          },
          number: {
            type: 'number',
          },
          enumWithNull: {
            enum: ['some', 'different', 'value'],
            type: ['string', 'null'],
          },
          'boolean required': {
            type: 'boolean',
          },
          'boolean optional null': {
            type: ['boolean', 'null'],
          },
        },
        additionalProperties: false,
      };
      expect(schema).toEqual(expected);
    });
    it('object property forbidden', () => {
      const joi = Joi.object().keys({
        string: Joi.string(),
        'string default': Joi.string().default('bar'),
        'number forbidden': Joi.number().forbidden(),
        'boolean required': Joi.boolean().required(),
      });
      const schema = convert(joi);
      const expected = {
        type: 'object',
        required: ['boolean required'],
        properties: {
          string: {
            type: 'string',
          },
          'string default': {
            type: 'string',
            default: 'bar',
          },
          'number forbidden': {
            type: 'number',
            forbidden: true,
          },
          'boolean required': {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      };
      expect(schema).toEqual(expected);
    });
    it('type: array', () => {
      const joi = Joi.array();
      const schema = convert(joi);
      const expected = {
        type: 'array',
      };
      expect(schema).toEqual(expected);
    });
    it('type: array with allow null', () => {
      const joi = Joi.array().allow(null);
      const schema = convert(joi);
      const expected = {
        type: ['array', 'null'],
      };
      expect(schema).toEqual(expected);
    });
    it('enum', () => {
      const joi = Joi.string().valid('a', 'b');
      const schema = convert(joi);
      const expected = {
        type: 'string',
        enum: ['a', 'b'],
      };
      // console.log('.enum: %s', util.inspect({type: joi._type, schema: schema}, {depth: 10}));
      expect(schema).toEqual(expected);
    });
    it('date', () => {
      const joi = Joi.date();
      const schema = convert(joi);
      const expected = {
        type: 'string',
        format: 'date-time',
      };
      expect(schema).toEqual(expected);
    });
    it('date min/max', () => {
      const joi = Joi.date()
        .min('1-1-2010')
        .max('1-1-2020');
      const schema = convert(joi);
      const expected = {
        type: 'string',
        minimum: new Date('1-1-2010').toISOString(), // '2010-01-01T00:00:00.000Z'
        maximum: new Date('1-1-2020').toISOString(), // '2020-01-01T00:00:00.000Z'
      };
      expect(schema).toEqual(expected);
    });
    it('date (javascript timestamp)', () => {
      const joi = Joi.date().timestamp();
      const schema = convert(joi);
      const expected = {
        type: 'string',
        format: 'javascript',
      };
      expect(schema).toEqual(expected);
    });
    it('date (unix timestamp)', () => {
      const joi = Joi.date().timestamp('unix');
      const schema = convert(joi);
      const expected = {
        type: 'string',
        format: 'unix',
      };
      expect(schema).toEqual(expected);
    });
    it('alternatives -> oneOf', () => {
      const joi = Joi.object().keys({
        value: Joi.alternatives().try(Joi.string().valid('a'), Joi.number().valid(100)),
      });
      const schema = convert(joi);
      const expected = {
        type: 'object',
        additionalProperties: false,
        properties: {
          value: {
            oneOf: [
              {
                type: 'string',
                enum: ['a'],
              },
              {
                type: 'number',
                enum: [100],
              },
            ],
          },
        },
      };
      // console.log('alt -> oneOf: %s', util.inspect({type: joi._type, schema: schema}, {depth: 10}));
      expect(schema).toEqual(expected);
    });
    it('string min/max', () => {
      const joi = Joi.string()
        .min(5)
        .max(100);
      const schema = convert(joi);
      const expected = {
        type: 'string',
        minLength: 5,
        maxLength: 100,
      };
      expect(schema).toEqual(expected);
    });
    it('string -> maxLength', () => {
      const joi = Joi.string().length(5);
      const schema = convert(joi);
      const expected = {
        type: 'string',
        maxLength: 5,
        minLength: 5,
      };
      expect(schema).toEqual(expected);
    });
    it('string email', () => {
      const joi = Joi.string().email();
      const schema = convert(joi);
      const expected = {
        type: 'string',
        format: 'email',
      };
      expect(schema).toEqual(expected);
    });
    it('string uri', () => {
      const joi = Joi.string().uri();
      const schema = convert(joi);
      const expected = {
        type: 'string',
        format: 'uri',
      };
      expect(schema).toEqual(expected);
    });
    it('string insensitive', () => {
      const joi = Joi.string()
        .valid('a')
        .insensitive();
      const schema = convert(joi);
      const expected = {
        type: 'string',
        enum: ['a'],
        insensitive: true,
      };
      expect(schema).toEqual(expected);
    });
    it('string regex -> pattern', () => {
      const joi = Joi.string().regex(/^[a-z]$/);
      const schema = convert(joi);
      const expected = {
        type: 'string',
        pattern: '^[a-z]$',
      };
      expect(schema).toEqual(expected);
    });
    it('string regex -> pattern and options', () => {
      const joi = Joi.string().pattern(/^[0-9]+$/, { name: 'numbers' });
      const schema = convert(joi);
      const expected = {
        format: 'numbers',
        pattern: '^[0-9]+$',
        type: 'string',
      };
      expect(schema).toEqual(expected);
    });
    it('string allow null', () => {
      const joi = Joi.string().allow('a', 'b', '', null);
      const schema = convert(joi);
      const expected = {
        type: ['string', 'null'],
        enum: ['a', 'b', ''],
      };
      // console.log('string allow: %s', util.inspect({type: joi._type, joi:joi, schema: schema}, {depth: 10}));
      expect(schema).toEqual(expected);
    });
    it('string allow without null', () => {
      const joi = Joi.string().allow('a', 'b', '');
      const schema = convert(joi);
      const expected = {
        type: 'string',
        enum: ['a', 'b', ''],
      };
      // console.log('string allow: %s', util.inspect({type: joi._type, joi:joi, schema: schema}, {depth: 10}));
      expect(schema).toEqual(expected);
    });
    it('number min/max', () => {
      const joi = Joi.number()
        .min(0)
        .max(100);
      const schema = convert(joi);
      const expected = {
        type: 'number',
        minimum: 0,
        maximum: 100,
      };
      expect(schema).toEqual(expected);
    });
    it('number greater/less', () => {
      const joi = Joi.number()
        .greater(0)
        .less(100);
      const schema = convert(joi);
      const expected = {
        type: 'number',
        minimum: 0,
        exclusiveMinimum: true,
        maximum: 100,
        exclusiveMaximum: true,
      };
      expect(schema).toEqual(expected);
    });
    it('number precision', () => {
      const joi = Joi.number().precision(2);
      const schema = convert(joi);
      const expected = {
        type: 'number',
        precision: 2,
      };
      expect(schema).toEqual(expected);
    });
    it('number multiple', () => {
      const joi = Joi.number().multiple(3);
      const schema = convert(joi);
      const expected = {
        type: 'number',
        multiple: 3,
      };
      expect(schema).toEqual(expected);
    });
    it('integer', () => {
      const joi = Joi.number().integer();
      const schema = convert(joi);
      const expected = {
        type: 'integer',
      };
      expect(schema).toEqual(expected);
    });
    it('array min/max', () => {
      const joi = Joi.array()
        .min(5)
        .max(100);
      const schema = convert(joi);
      const expected = {
        type: 'array',
        minItems: 5,
        maxItems: 100,
      };
      expect(schema).toEqual(expected);
    });
    it('array length', () => {
      const joi = Joi.array().length(100);
      const schema = convert(joi);
      const expected = {
        type: 'array',
        minItems: 100,
        maxItems: 100,
      };
      expect(schema).toEqual(expected);
    });
    it('array unique', () => {
      const joi = Joi.array().unique();
      const schema = convert(joi);
      const expected = {
        type: 'array',
        format: 'unique',
      };
      expect(schema).toEqual(expected);
    });
    it('array inclusions', () => {
      const joi = Joi.array().items(Joi.string());
      const schema = convert(joi);
      const expected = {
        type: 'array',
        items: { type: 'string' },
      };
      expect(schema).toEqual(expected);
    });
    it('array ordered (tuple-like)', () => {
      const joi = Joi.array().ordered(Joi.string().required(), Joi.number().optional());
      const schema = convert(joi);
      const expected = {
        type: 'array',
        ordered: [{ type: 'string' }, { type: 'number' }],
      };
      expect(schema).toEqual(expected);
    });
    it('joi any', () => {
      const joi = Joi.any();
      const schema = convert(joi);
      const expected = {
        type: ['array', 'boolean', 'number', 'object', 'string', 'null'],
      };
      expect(schema).toEqual(expected);
    });
    it('type: any allow', () => {
      const joi = Joi.any().allow('a');
      const schema = convert(joi);
      const expected = {
        type: ['array', 'boolean', 'number', 'object', 'string', 'null'],
        anyOf: [{ type: 'any', enum: ['a'] }],
      };
      expect(schema).toEqual(expected);
    });
    it('joi binary with content encoding', () => {
      const joi = Joi.binary().encoding('base64');
      const schema = convert(joi);
      const expected = {
        type: 'string',
        contentMediaType: 'text/plain',
        contentEncoding: 'base64',
      };
      expect(schema).toEqual(expected);
    });
    it('joi binary with content type', () => {
      const joi = Joi.binary().meta({ contentMediaType: 'image/png' });
      const schema = convert(joi);
      const expected = {
        type: 'string',
        contentMediaType: 'image/png',
        contentEncoding: 'binary',
      };
      expect(schema).toEqual(expected);
    });
    it('joi function', () => {
      const joi = Joi.function();
      const schema = convert(joi);
      const expected = {
        type: 'function',
      };
      expect(schema).toEqual(expected);
    });
    it('joi link', () => {
      const joi = Joi.link('/a');
      const schema = convert(joi);
      const expected = {
        ancestor: 'root',
        path: ['a'],
        type: 'link',
      };
      expect(schema).toEqual(expected);
    });
    it('joi symbol', () => {
      const joi = Joi.symbol();
      const schema = convert(joi);
      const expected = {
        type: 'symbol',
      };
      expect(schema).toEqual(expected);
    });

    it('joi.conditional', () => {
      const joi = Joi.object({
        a: Joi.boolean()
          .required()
          .default(false),
        b: Joi.alternatives().conditional('a', {
          is: true,
          then: Joi.string().default('a is true'),
          otherwise: Joi.number().default(0),
        }),
      });
      const schema = convert(joi);
      const expected = {
        type: 'object',
        properties: {
          a: {
            type: 'boolean',
            default: false,
          },
          b: {
            oneOf: [
              {
                default: 'a is true',
                type: 'string',
              },
              {
                type: 'number',
                default: 0,
              },
            ],
          },
        },
        additionalProperties: false,
        required: ['a'],
      };
      // console.log('when: %s', util.inspect({type:joi._type,schema:schema}, {depth: 10}));
      expect(schema).toEqual(expected);
    });
  });
});
