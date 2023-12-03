import middlewareWrapper from '../../utils/middlewareWrapper.js';
import { responseSchema } from '../../specifications/paths/getTodos.js';
import TodoModel from '../../models/todo.js';

const getTodos = async (event) => {
  // middleware parses event body only
  const user = JSON.parse(event.requestContext.authorizer.user);

  const items = await TodoModel.getTodos(user.sub);

  return {
    statusCode: 200,
    // body: JSON.stringify({items}), // not needed, the response gets serialized by the middleware
    body: { items },
  };
};
export const handler = middlewareWrapper({
  handler: getTodos,
  parseJSON: false,
  responseSchema,
});
