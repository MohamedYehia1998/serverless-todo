import { transpileSchema } from '@middy/validator/transpile'
import todoSchema from '../components/todo.js'

const eventSchema = transpileSchema({
  type: 'object',
  required: ['body'],
  properties: {
    body: {
      type: 'object',
      required: ['name', 'dueDate'],
      additionalProperties: false,
      properties: {
        name: { type: 'string', pattern: '[a-zA-Z0-9!@#$%^&*]+' },
        dueDate: { type: 'string' }
        // schema options https://ajv.js.org/json-schema.html#json-data-type
      }
    }
  }
})

const responseSchema = transpileSchema({
  type: 'object',
  required: ['body', 'statusCode'],
  properties: {
    body: {
      type: 'object',
      properties: {
        item: { 
          ...todoSchema
        },
      },

    },
    statusCode: {
      type: 'number'
    }
  }
})
// const responseSchema = transpileSchema({
//   type: 'object',
//   required: ['body', 'statusCode'],
//   properties: {
//     body: {
//       type: 'object',
//     },
//     statusCode: {
//       type: 'number'
//     }
//   }
// })

export {eventSchema, responseSchema}