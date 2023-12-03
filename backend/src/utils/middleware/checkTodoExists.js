import TodoModel from '../../models/todo.js';
import { createLogger } from '../logger.mjs';

const checkTodoExists = () => {
  const logger = createLogger('checkTodoExists');
  return {
    before: async (request) => {
      // Access the error from the handler.error object
      const { event } = request;
      const todoId = event.pathParameters.todoId;
      const user = JSON.parse(event.requestContext.authorizer.user);
      const key = { userId: user.sub, todoId };

      const todo = await TodoModel.getTodoById(key);

      if (!todo) {
        logger.error('Todo not found');
        return {
          // the http-serializer does not work on this one, hence we serialize manually
          body: JSON.stringify({ message: 'Todo not found' }),
          statusCode: 404,
        };
      } else {
        logger.info('Todo found');
        event.todo = JSON.stringify({ ...todo });
      }
    },
  };
};

export default checkTodoExists;
