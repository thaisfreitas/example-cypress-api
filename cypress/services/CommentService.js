/**
 * Comment Service
 * Gerencia todas as operações relacionadas a comentários
 */

const BaseService = require('./BaseService');
const APIHelper = require('../support/api-helper');

class CommentService extends BaseService {
  constructor() {
    super('/comments');
  }

  /**
   * Cria um novo comentário
   */
  createComment(postId, commentData = null) {
    const comment = commentData || APIHelper.generateFakeComment();
    comment.postId = postId;
    return this.post(comment);
  }

  /**
   * Busca todos os comentários
   */
  getAllComments() {
    return this.getAll();
  }

  /**
   * Busca comentário por ID
   */
  getCommentById(commentId) {
    return this.getById(commentId);
  }

  /**
   * Busca comentários por postId
   */
  getCommentsByPostId(postId) {
    return this.getAll({ postId: postId });
  }

  /**
   * Busca comentários por email
   */
  getCommentsByEmail(email) {
    return this.getAll({ email: email });
  }

  /**
   * Atualiza comentário
   */
  updateComment(commentId, commentData) {
    return this.put(commentId, commentData);
  }

  /**
   * Deleta comentário
   */
  deleteComment(commentId) {
    return this.delete(commentId);
  }

  /**
   * Valida estrutura de um comentário
   */
  validateCommentStructure(comment) {
    expect(comment).to.have.property('id');
    expect(comment).to.have.property('postId');
    expect(comment).to.have.property('name');
    expect(comment).to.have.property('email');
    expect(comment).to.have.property('body');
    expect(comment.email).to.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
  }

  /**
   * Valida lista de comentários
   */
  validateCommentsList(comments) {
    expect(comments).to.be.an('array');
    expect(comments.length).to.be.greaterThan(0);
    comments.forEach(comment => this.validateCommentStructure(comment));
  }
}

module.exports = new CommentService();

