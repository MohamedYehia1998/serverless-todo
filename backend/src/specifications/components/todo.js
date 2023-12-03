const todoSchema =
{
    type: 'object',
    required: ['name', 'dueDate', 'userId', 'todoId', 'createdAt', 'done'],
    properties: {
        name: { type: 'string' },
        dueDate: { type: 'string' },
        userId: { type: 'string' },
        todoId: { type: 'string' },
        createdAt: { type: 'string' },
        done: { type: 'boolean' },
        attachmentUrl: { type: 'string' }
        // schema options https://ajv.js.org/json-schema.html#json-data-type
    }
}

export default todoSchema;