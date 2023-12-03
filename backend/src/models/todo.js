import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
  QueryCommand,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';
import AWSXRay from 'aws-xray-sdk';

class TodoModel {
  static docClient = DynamoDBDocumentClient.from(AWSXRay.captureAWSv3Client(new DynamoDBClient({})));

  static createTodo = async (todo) => {
    const params = {
      TableName: process.env.TODOS_TABLE,
      Item: todo,
    };

    const command = new PutCommand(params);
    await TodoModel.docClient.send(command);
  };

  static deleteTodo = async (key) => {
    const command = new DeleteCommand({
      TableName: process.env.TODOS_TABLE,
      Key: { userId: key.userId, todoId: key.todoId },
    });

    await TodoModel.docClient.send(command);
  };

  static getTodos = async (userId) => {
    const params = {
      TableName: process.env.TODOS_TABLE,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ConsistentRead: true,
    };

    const command = new QueryCommand(params);
    const { Items } = await TodoModel.docClient.send(command);

    return Items;
  };

  static getTodoById = async (key) => {
    const { userId, todoId } = key;
    const params = {
      TableName: process.env.TODOS_TABLE,
      Key: {
        userId: userId,
        todoId: todoId,
      },
    };
    const command = new GetCommand(params);
    const response = await TodoModel.docClient.send(command);
    return response.Item;
  };

  static updateTodo = async (key, fields) => {
    const updateExpressionParts = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};

    if (fields.name) {
      updateExpressionParts.push('#todoName = :todoName'); // name cannot be used as it is a reserved name in dynamodb so we replace it with #todoName
      expressionAttributeValues[':todoName'] = fields.name;
      expressionAttributeNames['#todoName'] = 'name';
    }

    if (fields.dueDate) {
      updateExpressionParts.push('dueDate = :dueDate');
      expressionAttributeValues[':dueDate'] = fields.dueDate;
    }

    if (fields.done !== undefined) {
      updateExpressionParts.push('done = :done');
      expressionAttributeValues[':done'] = fields.done;
    }

    if (fields.attachmentUrl) {
      updateExpressionParts.push('attachmentUrl = :attachmentUrl');
      expressionAttributeValues[':attachmentUrl'] = fields.attachmentUrl;
    }

    const params = {
      TableName: process.env.TODOS_TABLE,
      Key: { userId: key.userId, todoId: key.todoId },
      UpdateExpression: `set ${updateExpressionParts.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: 'NONE',
    };

    if (!fields.name) {
      delete params.ExpressionAttributeNames;
    }

    const command = new UpdateCommand(params);

    await TodoModel.docClient.send(command);
  };
}

export default TodoModel;
