// ***********************************************************
// This file is processed and loaded automatically before your test files.
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands
import './commands';

// Import plugins
import 'cypress-mochawesome-reporter/register';
import '@cypress/grep';

// Configurações globais
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retorna false para prevenir que o Cypress falhe o teste
  // em exceções não capturadas
  console.log('Uncaught exception:', err.message);
  return false;
});

// Hook global antes de cada teste
beforeEach(() => {
  cy.log('🚀 Starting test...');
});

// Hook global após cada teste
afterEach(function() {
  if (this.currentTest.state === 'failed') {
    cy.log('❌ Test failed!');
  } else {
    cy.log('✅ Test passed!');
  }
});

