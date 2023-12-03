import { transpileSchema } from '@middy/validator/transpile';

const eventSchema = transpileSchema({
  type: 'object',
  required: ['pathParameters'],
  properties: {
    pathParameters: {
      type: 'object',
      required: ['todoId'],
      additionalProperties: false,
      properties: {
        todoId: { type: 'string' },
        // schema options https://ajv.js.org/json-schema.html#json-data-type
      },
    },
  },
});

const responseSchema = transpileSchema({
  type: 'object',
  required: ['body', 'statusCode'],
  properties: {
    body: {
      type: 'object',
      properties: {
        uploadUrl: {
          type: 'string',
        },
      },
    },
    statusCode: {
      type: 'number',
    },
  },
});

export { eventSchema, responseSchema };
