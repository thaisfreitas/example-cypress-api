/**
 * User Service
 * Gerencia todas as operações relacionadas a usuários
 */

const BaseService = require('./BaseService');
const APIHelper = require('../support/api-helper');

class UserService extends BaseService {
  constructor() {
    super('/users');
  }

  /**
   * Cria um novo usuário
   */
  createUser(userData = null) {
    const user = userData || APIHelper.generateFakeUser();
    return this.post(user);
  }

  /**
   * Busca todos os usuários
   */
  getAllUsers() {
    return this.getAll();
  }

  /**
   * Busca usuário por ID
   */
  getUserById(userId) {
    return this.getById(userId);
  }

  /**
   * Atualiza usuário (PUT - substitui completamente)
   */
  updateUser(userId, userData) {
    return this.put(userId, userData);
  }

  /**
   * Atualiza usuário parcialmente (PATCH)
   */
  patchUser(userId, userData) {
    return this.patch(userId, userData);
  }

  /**
   * Deleta usuário
   */
  deleteUser(userId) {
    return this.delete(userId);
  }

  /**
   * Busca posts de um usuário específico
   */
  getUserPosts(userId) {
    return this.get(`/${userId}/posts`);
  }

  /**
   * Busca albums de um usuário específico
   */
  getUserAlbums(userId) {
    return this.get(`/${userId}/albums`);
  }

  /**
   * Busca todos os TODOs de um usuário
   */
  getUserTodos(userId) {
    return this.get(`/${userId}/todos`);
  }

  /**
   * Valida estrutura de um usuário
   */
  validateUserStructure(user) {
    expect(user).to.have.property('id');
    expect(user).to.have.property('name');
    expect(user).to.have.property('username');
    expect(user).to.have.property('email');
    expect(user.email).to.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
  }

  /**
   * Valida lista de usuários
   */
  validateUsersList(users) {
    expect(users).to.be.an('array');
    expect(users.length).to.be.greaterThan(0);
    users.forEach(user => this.validateUserStructure(user));
  }
}

module.exports = new UserService();

