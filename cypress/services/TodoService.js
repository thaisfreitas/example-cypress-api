/**
 * Todo Service
 * Gerencia todas as operações relacionadas a TODOs
 */

const BaseService = require('./BaseService');
const APIHelper = require('../support/api-helper');

class TodoService extends BaseService {
  constructor() {
    super('/todos');
  }

  /**
   * Cria um novo TODO
   */
  createTodo(todoData = null) {
    const todo = todoData || APIHelper.generateFakeTodo();
    return this.post(todo);
  }

  /**
   * Busca todos os TODOs
   */
  getAllTodos() {
    return this.getAll();
  }

  /**
   * Busca TODO por ID
   */
  getTodoById(todoId) {
    return this.getById(todoId);
  }

  /**
   * Busca TODOs por userId
   */
  getTodosByUserId(userId) {
    return this.getAll({ userId: userId });
  }

  /**
   * Busca TODOs completados
   */
  getCompletedTodos() {
    return this.getAll({ completed: true });
  }

  /**
   * Busca TODOs pendentes
   */
  getPendingTodos() {
    return this.getAll({ completed: false });
  }

  /**
   * Atualiza TODO
   */
  updateTodo(todoId, todoData) {
    return this.put(todoId, todoData);
  }

  /**
   * Marca TODO como completo
   */
  completeTodo(todoId) {
    return this.patch(todoId, { completed: true });
  }

  /**
   * Deleta TODO
   */
  deleteTodo(todoId) {
    return this.delete(todoId);
  }

  /**
   * Valida estrutura de um TODO
   */
  validateTodoStructure(todo) {
    expect(todo).to.have.property('id');
    expect(todo).to.have.property('userId');
    expect(todo).to.have.property('title');
    expect(todo).to.have.property('completed');
    expect(todo.completed).to.be.a('boolean');
  }

  /**
   * Valida lista de TODOs
   */
  validateTodosList(todos) {
    expect(todos).to.be.an('array');
    expect(todos.length).to.be.greaterThan(0);
    todos.forEach(todo => this.validateTodoStructure(todo));
  }
}

module.exports = new TodoService();

