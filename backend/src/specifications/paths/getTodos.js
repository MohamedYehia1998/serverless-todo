import { transpileSchema } from '@middy/validator/transpile';
import todoSchema from '../components/todo.js';

const responseSchema = transpileSchema({
  type: 'object',
  required: ['body', 'statusCode'],
  properties: {
    body: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            ...todoSchema,
          },
        },
      },
    },
    statusCode: {
      type: 'number',
    },
  },
});

export { responseSchema };
