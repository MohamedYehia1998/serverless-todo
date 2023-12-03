import middlewareWrapper from '../../utils/middlewareWrapper.js';
import { eventSchema } from '../../specifications/paths/deleteTodo.js';
import TodoModel from '../../models/todo.js';
import S3 from '../../utils/s3.js';
import { createLogger } from '../../utils/logger.mjs';

const deleteTodo = async (event) => {
  const logger = createLogger('deleteTodo');

  const todoId = event.pathParameters.todoId;
  const user = JSON.parse(event.requestContext.authorizer.user); // retrieved from authorizer
  const todo = JSON.parse(event.todo); // retrieved from checkTodoExists middleware

  const key = { userId: user.sub, todoId };

  await TodoModel.deleteTodo(key);

  if (todo.attachmentUrl) {
    logger.info('deleting todo image');
    const params = {
      Bucket: process.env.TODOS_BUCKET,
      Key: `${todoId}.jpeg`,
    };
    await S3.deleteObject(params).promise();
  }

  return {
    statusCode: 200,
    body: {},
  };
};

export const handler = middlewareWrapper({
  handler: deleteTodo,
  eventSchema,
  parseJSON: false,
  findTodo: true,
});
