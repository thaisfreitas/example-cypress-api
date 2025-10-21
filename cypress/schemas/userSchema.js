/**
 * JSON Schema para validação de usuários
 */

const userSchema = {
  type: 'object',
  required: ['id', 'name', 'username', 'email'],
  properties: {
    id: {
      type: 'number'
    },
    name: {
      type: 'string',
      minLength: 1
    },
    username: {
      type: 'string',
      minLength: 1
    },
    email: {
      type: 'string',
      format: 'email'
    },
    address: {
      type: 'object',
      properties: {
        street: { type: 'string' },
        suite: { type: 'string' },
        city: { type: 'string' },
        zipcode: { type: 'string' },
        geo: {
          type: 'object',
          properties: {
            lat: { type: 'string' },
            lng: { type: 'string' }
          }
        }
      }
    },
    phone: {
      type: 'string'
    },
    website: {
      type: 'string'
    },
    company: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        catchPhrase: { type: 'string' },
        bs: { type: 'string' }
      }
    }
  }
};

const usersArraySchema = {
  type: 'array',
  items: userSchema,
  minItems: 1
};

module.exports = { userSchema, usersArraySchema };

