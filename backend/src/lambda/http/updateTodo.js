import middlewareWrapper from '../../utils/middlewareWrapper.js';
import { eventSchema } from '../../specifications/paths/updateTodo.js';
import TodoModel from '../../models/todo.js';

const updateTodo = async (event) => {
  const todoId = event.pathParameters.todoId;
  const user = JSON.parse(event.requestContext.authorizer.user);

  const key = { userId: user.sub, todoId };
  const fields = {
    name: event.body.name,
    dueDate: event.body.dueDate,
    done: event.body.done,
  };

  await TodoModel.updateTodo(key, fields);

  return {
    statusCode: 200,
    body: {},
  };
};

export const handler = middlewareWrapper({
  handler: updateTodo,
  eventSchema,
  parseJSON: true,
  findTodo: true,
});
