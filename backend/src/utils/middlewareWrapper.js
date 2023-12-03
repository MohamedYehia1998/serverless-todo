import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpResponseSerializer from '@middy/http-response-serializer';
import validator from '@middy/validator';
import checkTodoExists from './middleware/checkTodoExists.js';

const middleware = (config) => {
  const { handler, eventSchema, responseSchema, parseJSON, findTodo } = config;

  /* !!!!! IMPORTANT !!!!! Middleware follow onion-like sequence (see middy documentation) */
  /* Sequence influences the flow. e.g: httpJsonBodyParser() before hook must run before validator before hook (for eventSchema)  */

  /* !!!!! This sequence must be enforce*/

  /* BEFORE Request middlwares sequence:
        1- httpJsonBodyParser()
        2- validator({eventSchema})
    */

  /* AFTER Reponse middlwares sequence:
        1- validator({responseSchema})
        2- httpResponseSerializer()
        3- cors()
    */

  const middlewares = [];

  if (parseJSON || parseJSON === undefined) {
    middlewares.push(httpJsonBodyParser());
  }

  if (eventSchema || responseSchema) {
    const validatorObject = {};
    if (eventSchema) {
      validatorObject.eventSchema = eventSchema;
    }
    if (responseSchema) {
      validatorObject.responseSchema = responseSchema;
    }
    middlewares.push(validator(validatorObject));
  }

  if (findTodo) {
    middlewares.push(checkTodoExists());
  }

  /* This enforces that validator({eventSchema}) is never before httpJsonBodyParser()
       AND serialization happens after lambda response as the validator cannot process serialized data.

       TIP: order middlewares with an after hook in the order of importance.
    */

  return middy()
    .use(cors())
    .use(
      httpResponseSerializer({
        serializers: [
          {
            regex: /^application\/xml$/,
            serializer: ({ body }) => `<message>${body}</message>`,
          },
          {
            regex: /^application\/json$/,
            serializer: ({ body }) => JSON.stringify(body),
          },
          {
            regex: /^text\/plain$/,
            serializer: ({ body }) => body,
          },
        ],
        defaultContentType: 'application/json',
      })
    )
    .use(middlewares)
    .use(httpErrorHandler())
    .handler(handler);
};
export default middleware;
