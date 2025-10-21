/**
 * API Helper Functions
 * Funções utilitárias para auxiliar nos testes de API
 */

/**
 * Gera dados fake usando Faker
 */
const { faker } = require('@faker-js/faker');

class APIHelper {
  /**
   * Gera um usuário fake
   */
  static generateFakeUser() {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
      phone: faker.phone.number(),
      website: faker.internet.url(),
      address: {
        street: faker.location.street(),
        city: faker.location.city(),
        zipcode: faker.location.zipCode()
      },
      company: {
        name: faker.company.name(),
        catchPhrase: faker.company.catchPhrase()
      }
    };
  }

  /**
   * Gera um post fake
   */
  static generateFakePost() {
    return {
      title: faker.lorem.sentence(),
      body: faker.lorem.paragraphs(2),
      userId: faker.number.int({ min: 1, max: 10 })
    };
  }

  /**
   * Gera um comentário fake
   */
  static generateFakeComment() {
    return {
      name: faker.lorem.sentence(),
      email: faker.internet.email(),
      body: faker.lorem.paragraph()
    };
  }

  /**
   * Gera um TODO fake
   */
  static generateFakeTodo() {
    return {
      title: faker.lorem.sentence(),
      completed: faker.datatype.boolean(),
      userId: faker.number.int({ min: 1, max: 10 })
    };
  }

  /**
   * Valida estrutura básica de resposta
   */
  static validateBasicResponse(response) {
    expect(response).to.have.property('status');
    expect(response).to.have.property('body');
    expect(response).to.have.property('headers');
    expect(response.headers).to.have.property('content-type');
  }

  /**
   * Valida headers comuns de API REST
   */
  static validateCommonHeaders(response) {
    expect(response.headers).to.have.property('content-type');
    expect(response.headers['content-type']).to.include('application/json');
  }

  /**
   * Extrai ID da resposta (útil para testes de fluxo)
   */
  static extractId(response) {
    if (Array.isArray(response.body)) {
      return response.body[0].id;
    }
    return response.body.id;
  }

  /**
   * Aguarda um tempo específico (útil para testes de performance)
   */
  static wait(ms) {
    return cy.wait(ms);
  }

  /**
   * Loga informações detalhadas da resposta
   */
  static logResponse(response, title = 'API Response') {
    cy.log(`📋 ${title}`);
    cy.log(`   Status: ${response.status}`);
    cy.log(`   Duration: ${response.duration}ms`);
    
    if (Array.isArray(response.body)) {
      cy.log(`   Body: Array with ${response.body.length} items`);
    } else {
      cy.log(`   Body: ${JSON.stringify(response.body).substring(0, 100)}...`);
    }
  }

  /**
   * Compara dois objetos ignorando campos específicos
   */
  static compareObjects(obj1, obj2, ignoreFields = []) {
    const filtered1 = this.removeFields(obj1, ignoreFields);
    const filtered2 = this.removeFields(obj2, ignoreFields);
    
    expect(filtered1).to.deep.equal(filtered2);
  }

  /**
   * Remove campos de um objeto
   */
  static removeFields(obj, fields) {
    const newObj = { ...obj };
    fields.forEach(field => delete newObj[field]);
    return newObj;
  }

  /**
   * Valida paginação
   */
  static validatePagination(response, expectedLimit) {
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.at.most(expectedLimit);
  }

  /**
   * Filtra array por propriedade
   */
  static filterByProperty(array, property, value) {
    return array.filter(item => item[property] === value);
  }

  /**
   * Ordena array por propriedade
   */
  static sortByProperty(array, property, order = 'asc') {
    return array.sort((a, b) => {
      if (order === 'asc') {
        return a[property] > b[property] ? 1 : -1;
      }
      return a[property] < b[property] ? 1 : -1;
    });
  }
}

module.exports = APIHelper;

