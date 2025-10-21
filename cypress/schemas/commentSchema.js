/**
 * JSON Schema para validação de comentários
 */

const commentSchema = {
  type: 'object',
  required: ['postId', 'id', 'name', 'email', 'body'],
  properties: {
    postId: {
      type: 'number'
    },
    id: {
      type: 'number'
    },
    name: {
      type: 'string',
      minLength: 1
    },
    email: {
      type: 'string',
      format: 'email'
    },
    body: {
      type: 'string',
      minLength: 1
    }
  }
};

const commentsArraySchema = {
  type: 'array',
  items: commentSchema,
  minItems: 1
};

module.exports = { commentSchema, commentsArraySchema };

