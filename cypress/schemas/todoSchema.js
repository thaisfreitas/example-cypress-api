/**
 * JSON Schema para validação de TODOs
 */

const todoSchema = {
  type: 'object',
  required: ['userId', 'id', 'title', 'completed'],
  properties: {
    userId: {
      type: 'number'
    },
    id: {
      type: 'number'
    },
    title: {
      type: 'string',
      minLength: 1
    },
    completed: {
      type: 'boolean'
    }
  }
};

const todosArraySchema = {
  type: 'array',
  items: todoSchema,
  minItems: 1
};

module.exports = { todoSchema, todosArraySchema };

