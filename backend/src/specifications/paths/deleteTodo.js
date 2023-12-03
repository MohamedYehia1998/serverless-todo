import { transpileSchema } from '@middy/validator/transpile'

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
        }
      }
    }
  })

  export {eventSchema}