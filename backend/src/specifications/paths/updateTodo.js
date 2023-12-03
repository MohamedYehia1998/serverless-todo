import { transpileSchema } from '@middy/validator/transpile'

const eventSchema = transpileSchema({
    type: 'object',
    required: ['pathParameters', 'body'],
    properties: {
      pathParameters: {
        type: 'object',
        required: ['todoId'],
        additionalProperties: false,
        properties: {
          todoId: { type: 'string' },
          // schema options https://ajv.js.org/json-schema.html#json-data-type
        }
      },
      body: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'dueDate', 'done'],
        properties: {
          name: { type: 'string' },
          dueDate: { type: 'string' },
          done: { type: 'boolean' }
          // schema options https://ajv.js.org/json-schema.html#json-data-type
        }        
      }
    }
  })

  export {eventSchema}