// ***********************************************
// Custom Commands for API Testing
// ***********************************************

/**
 * Comando customizado para fazer requisições GET com validações
 * @example cy.apiGet('/users', 200)
 */
Cypress.Commands.add('apiGet', (endpoint, expectedStatus = 200, options = {}) => {
  cy.log(`🔍 GET Request: ${endpoint}`);
  
  return cy.request({
    method: 'GET',
    url: endpoint,
    failOnStatusCode: false,
    ...options
  }).then((response) => {
    expect(response.status).to.eq(expectedStatus);
    cy.log(`✅ Status: ${response.status}`);
    return cy.wrap(response);
  });
});

/**
 * Comando customizado para fazer requisições POST
 * @example cy.apiPost('/users', { name: 'John' }, 201)
 */
Cypress.Commands.add('apiPost', (endpoint, body, expectedStatus = 201, options = {}) => {
  cy.log(`📤 POST Request: ${endpoint}`);
  
  return cy.request({
    method: 'POST',
    url: endpoint,
    body: body,
    failOnStatusCode: false,
    ...options
  }).then((response) => {
    expect(response.status).to.eq(expectedStatus);
    cy.log(`✅ Status: ${response.status}`);
    return cy.wrap(response);
  });
});

/**
 * Comando customizado para fazer requisições PUT
 * @example cy.apiPut('/users/1', { name: 'John Updated' }, 200)
 */
Cypress.Commands.add('apiPut', (endpoint, body, expectedStatus = 200, options = {}) => {
  cy.log(`✏️ PUT Request: ${endpoint}`);
  
  return cy.request({
    method: 'PUT',
    url: endpoint,
    body: body,
    failOnStatusCode: false,
    ...options
  }).then((response) => {
    expect(response.status).to.eq(expectedStatus);
    cy.log(`✅ Status: ${response.status}`);
    return cy.wrap(response);
  });
});

/**
 * Comando customizado para fazer requisições PATCH
 * @example cy.apiPatch('/users/1', { name: 'John' }, 200)
 */
Cypress.Commands.add('apiPatch', (endpoint, body, expectedStatus = 200, options = {}) => {
  cy.log(`🔧 PATCH Request: ${endpoint}`);
  
  return cy.request({
    method: 'PATCH',
    url: endpoint,
    body: body,
    failOnStatusCode: false,
    ...options
  }).then((response) => {
    expect(response.status).to.eq(expectedStatus);
    cy.log(`✅ Status: ${response.status}`);
    return cy.wrap(response);
  });
});

/**
 * Comando customizado para fazer requisições DELETE
 * @example cy.apiDelete('/users/1', 200)
 */
Cypress.Commands.add('apiDelete', (endpoint, expectedStatus = 200, options = {}) => {
  cy.log(`🗑️ DELETE Request: ${endpoint}`);
  
  return cy.request({
    method: 'DELETE',
    url: endpoint,
    failOnStatusCode: false,
    ...options
  }).then((response) => {
    expect(response.status).to.eq(expectedStatus);
    cy.log(`✅ Status: ${response.status}`);
    return cy.wrap(response);
  });
});

/**
 * Comando para validar schema JSON usando AJV
 * @example cy.wrap(response.body).validateSchema(schema)
 */
Cypress.Commands.add('validateSchema', { prevSubject: true }, (subject, schema) => {
  cy.log('🔍 Validating JSON Schema...');
  
  const Ajv = require('ajv');
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(subject);
  
  if (!valid) {
    cy.log('❌ Schema validation failed:');
    console.error('Schema errors:', validate.errors);
    throw new Error(`Schema validation failed: ${JSON.stringify(validate.errors)}`);
  }
  
  cy.log('✅ Schema validation passed');
  return cy.wrap(subject);
});

/**
 * Comando para validar tempo de resposta
 * @example cy.validateResponseTime(response, 1000)
 */
Cypress.Commands.add('validateResponseTime', (response, maxTime) => {
  const duration = response.duration;
  cy.log(`⏱️ Response time: ${duration}ms (max: ${maxTime}ms)`);
  expect(duration).to.be.lessThan(maxTime);
});

/**
 * Comando para fazer autenticação (exemplo para APIs que precisam)
 * @example cy.authenticate('user', 'password')
 */
Cypress.Commands.add('authenticate', (username, password) => {
  cy.log('🔐 Authenticating...');
  
  // Este é um exemplo - ajuste conforme sua API
  return cy.request({
    method: 'POST',
    url: '/auth/login',
    body: {
      username: username,
      password: password
    }
  }).then((response) => {
    // Salvar token no localStorage ou variável de ambiente
    const token = response.body.token;
    Cypress.env('authToken', token);
    cy.log('✅ Authentication successful');
    return cy.wrap(token);
  });
});

/**
 * Comando para fazer requisição com autenticação
 * @example cy.apiRequestAuth('GET', '/protected-endpoint')
 */
Cypress.Commands.add('apiRequestAuth', (method, endpoint, body = null) => {
  const token = Cypress.env('authToken');
  
  return cy.request({
    method: method,
    url: endpoint,
    body: body,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
});

