import TodoModel from '../../models/todo.js';
import { eventSchema, responseSchema } from '../../specifications/paths/generateUploadUrl.js';
import middlewareWrapper from '../../utils/middlewareWrapper.js';
import S3 from '../../utils/s3.js';

async function getUploadURL(event) {
  const todoId = event.pathParameters.todoId;
  const user = JSON.parse(event.requestContext.authorizer.user);

  const key = { userId: user.sub, todoId };

  const params = {
    Bucket: process.env.TODOS_BUCKET,
    Key: `${todoId}.jpeg`,
    Expires: 60 * 5,
    ContentType: 'image/jpeg',
  };
  const signedUrl = S3.getSignedUrl('putObject', params);
  const attachmentUrl = `https://${process.env.TODOS_BUCKET}.s3.amazonaws.com/${params.Key}`;

  await TodoModel.updateTodo(key, { attachmentUrl });

  return {
    statusCode: 201,
    body: { uploadUrl: signedUrl },
  };
}

export const handler = middlewareWrapper({
  handler: getUploadURL,
  parseJSON: false,
  findTodo: true,
  eventSchema,
  responseSchema
});
