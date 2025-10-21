/**
 * JSON Schema para validação de posts
 */

const postSchema = {
  type: 'object',
  required: ['userId', 'id', 'title', 'body'],
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
    body: {
      type: 'string',
      minLength: 1
    }
  }
};

const postsArraySchema = {
  type: 'array',
  items: postSchema,
  minItems: 1
};

module.exports = { postSchema, postsArraySchema };

