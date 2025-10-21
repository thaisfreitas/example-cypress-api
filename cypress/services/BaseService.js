/**
 * Base Service Class
 * Classe base para todos os services de API
 * Implementa métodos comuns e reutilizáveis
 */

class BaseService {
  constructor(baseEndpoint) {
    this.baseEndpoint = baseEndpoint;
  }

  /**
   * GET request
   */
  get(path = '', expectedStatus = 200, options = {}) {
    const url = `${this.baseEndpoint}${path}`;
    return cy.apiGet(url, expectedStatus, options);
  }

  /**
   * POST request
   */
  post(body, path = '', expectedStatus = 201, options = {}) {
    const url = `${this.baseEndpoint}${path}`;
    return cy.apiPost(url, body, expectedStatus, options);
  }

  /**
   * PUT request
   */
  put(id, body, expectedStatus = 200, options = {}) {
    const url = `${this.baseEndpoint}/${id}`;
    return cy.apiPut(url, body, expectedStatus, options);
  }

  /**
   * PATCH request
   */
  patch(id, body, expectedStatus = 200, options = {}) {
    const url = `${this.baseEndpoint}/${id}`;
    return cy.apiPatch(url, body, expectedStatus, options);
  }

  /**
   * DELETE request
   */
  delete(id, expectedStatus = 200, options = {}) {
    const url = `${this.baseEndpoint}/${id}`;
    return cy.apiDelete(url, expectedStatus, options);
  }

  /**
   * GET by ID
   */
  getById(id, expectedStatus = 200, options = {}) {
    return this.get(`/${id}`, expectedStatus, options);
  }

  /**
   * GET all with query params
   */
  getAll(queryParams = {}, expectedStatus = 200, options = {}) {
    const params = new URLSearchParams(queryParams).toString();
    const path = params ? `?${params}` : '';
    return this.get(path, expectedStatus, options);
  }
}

module.exports = BaseService;

