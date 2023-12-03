import { createLogger } from '../logger.mjs';

// Custom global error handler function
const globalErrorHandler = () => {
  const logger = createLogger('error');
  logger.error('Watch out there is an Error!');
  return {
    onError: (request) => {
      // Access the error from the handler.error object
      const error = request.error;

      logger.error('Watch out MO there is an Error!');

      return {
        body: JSON.stringify({
          error: { ...error, cause: JSON.stringify(error.cause) },
        }),
        statusCode: error.statusCode || 500,
      };
    },
  };
};

export default globalErrorHandler;
