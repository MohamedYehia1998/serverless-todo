import middlewareWrapper from '../../utils/middlewareWrapper.js';
import { v4 as uuid } from 'uuid';
import {
  eventSchema,
  responseSchema,
} from '../../specifications/paths/createTodo.js';
import TodoModel from '../../models/todo.js';

const createTodo = async (event) => {
  const { name, dueDate } = event.body;
  const user = JSON.parse(event.requestContext.authorizer.user);

  const todo = {
    userId: user.sub,
    todoId: uuid(),
    createdAt: new Date().toISOString(),
    name,
    dueDate,
    done: false,
  };

  await TodoModel.createTodo(todo);

  return {
    statusCode: 201,
    body: { item: todo },
  };
};
export const handler = middlewareWrapper({
  handler: createTodo,
  eventSchema,
  responseSchema,
});
