/**
 * Post Service
 * Gerencia todas as operações relacionadas a posts
 */

const BaseService = require('./BaseService');
const APIHelper = require('../support/api-helper');

class PostService extends BaseService {
  constructor() {
    super('/posts');
  }

  /**
   * Cria um novo post
   */
  createPost(postData = null) {
    const post = postData || APIHelper.generateFakePost();
    return this.post(post);
  }

  /**
   * Busca todos os posts
   */
  getAllPosts() {
    return this.getAll();
  }

  /**
   * Busca post por ID
   */
  getPostById(postId) {
    return this.getById(postId);
  }

  /**
   * Busca posts por userId
   */
  getPostsByUserId(userId) {
    return this.getAll({ userId: userId });
  }

  /**
   * Atualiza post
   */
  updatePost(postId, postData) {
    return this.put(postId, postData);
  }

  /**
   * Atualiza post parcialmente
   */
  patchPost(postId, postData) {
    return this.patch(postId, postData);
  }

  /**
   * Deleta post
   */
  deletePost(postId) {
    return this.delete(postId);
  }

  /**
   * Busca comentários de um post
   */
  getPostComments(postId) {
    return this.get(`/${postId}/comments`);
  }

  /**
   * Valida estrutura de um post
   */
  validatePostStructure(post) {
    expect(post).to.have.property('id');
    expect(post).to.have.property('title');
    expect(post).to.have.property('body');
    expect(post).to.have.property('userId');
    expect(post.title).to.be.a('string');
    expect(post.body).to.be.a('string');
    expect(post.userId).to.be.a('number');
  }

  /**
   * Valida lista de posts
   */
  validatePostsList(posts) {
    expect(posts).to.be.an('array');
    expect(posts.length).to.be.greaterThan(0);
    posts.forEach(post => this.validatePostStructure(post));
  }
}

module.exports = new PostService();

