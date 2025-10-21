/**
 * Testes de API - Posts Endpoint
 * @tags @api @posts @regression
 */

const PostService = require('../../../services/PostService');
const { postSchema, postsArraySchema } = require('../../../schemas/postSchema');
const APIHelper = require('../../../support/api-helper');

describe('API Tests - Posts Endpoint', () => {
  
  describe('GET /posts', { tags: ['@smoke', '@regression'] }, () => {
    
    it('Deve retornar todos os posts', () => {
      PostService.getAllPosts().then((response) => {
        expect(response.status).to.eq(200);
        APIHelper.validateCommonHeaders(response);
        
        // Validar estrutura
        PostService.validatePostsList(response.body);
        
        // Validar quantidade
        expect(response.body.length).to.be.at.least(100);
        
        // Validar schema
        cy.wrap(response.body).validateSchema(postsArraySchema);
      });
    });

  });

  describe('GET /posts/:id', { tags: ['@smoke', '@regression'] }, () => {
    
    it('Deve retornar um post específico', () => {
      const postId = 1;
      
      PostService.getPostById(postId).then((response) => {
        expect(response.status).to.eq(200);
        PostService.validatePostStructure(response.body);
        expect(response.body.id).to.eq(postId);
        
        // Validar schema
        cy.wrap(response.body).validateSchema(postSchema);
      });
    });

    it('Deve retornar 404 para post inexistente', () => {
      PostService.getPostById(999999, 404).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

  });

  describe('POST /posts', { tags: ['@regression'] }, () => {
    
    it('Deve criar um novo post', () => {
      const newPost = APIHelper.generateFakePost();
      
      PostService.createPost(newPost).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body.title).to.eq(newPost.title);
        expect(response.body.body).to.eq(newPost.body);
        expect(response.body.userId).to.eq(newPost.userId);
        
        cy.log(`✅ Post created with ID: ${response.body.id}`);
      });
    });

    it('Deve criar post usando fixture', () => {
      cy.fixture('posts').then((postsData) => {
        PostService.createPost(postsData.validPost).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('id');
          expect(response.body.title).to.eq(postsData.validPost.title);
        });
      });
    });

  });

  describe('PUT /posts/:id', { tags: ['@regression'] }, () => {
    
    it('Deve atualizar um post existente', () => {
      const postId = 1;
      const updatedPost = {
        id: postId,
        title: 'Updated Title',
        body: 'Updated body content',
        userId: 1
      };
      
      PostService.updatePost(postId, updatedPost).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.title).to.eq(updatedPost.title);
        expect(response.body.body).to.eq(updatedPost.body);
      });
    });

  });

  describe('PATCH /posts/:id', { tags: ['@regression'] }, () => {
    
    it('Deve atualizar parcialmente um post', () => {
      const postId = 1;
      const partialUpdate = {
        title: 'Only Title Updated'
      };
      
      PostService.patchPost(postId, partialUpdate).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.title).to.eq(partialUpdate.title);
      });
    });

  });

  describe('DELETE /posts/:id', { tags: ['@regression'] }, () => {
    
    it('Deve deletar um post', () => {
      const postId = 1;
      
      PostService.deletePost(postId).then((response) => {
        expect(response.status).to.eq(200);
        cy.log(`✅ Post ${postId} deleted successfully`);
      });
    });

  });

  describe('Query Parameters', { tags: ['@regression'] }, () => {
    
    it('Deve filtrar posts por userId', () => {
      const userId = 1;
      
      PostService.getPostsByUserId(userId).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        
        // Validar que todos os posts pertencem ao usuário
        response.body.forEach(post => {
          expect(post.userId).to.eq(userId);
        });
      });
    });

  });

  describe('Nested Resources', { tags: ['@regression'] }, () => {
    
    it('Deve retornar comentários de um post', () => {
      const postId = 1;
      
      PostService.getPostComments(postId).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);
        
        // Validar que todos os comentários pertencem ao post
        response.body.forEach(comment => {
          expect(comment.postId).to.eq(postId);
          expect(comment).to.have.property('email');
          expect(comment).to.have.property('body');
        });
      });
    });

  });

  describe('CRUD Flow Complete', { tags: ['@e2e'] }, () => {
    
    it('Deve executar fluxo completo: Create, Read, Update, Delete', () => {
      const newPost = APIHelper.generateFakePost();
      let createdPostId;

      // CREATE
      cy.log('🔹 Step 1: Creating post...');
      PostService.createPost(newPost).then((response) => {
        expect(response.status).to.eq(201);
        createdPostId = response.body.id;
        cy.log(`✅ Post created with ID: ${createdPostId}`);
      });

      // READ
      cy.then(() => {
        cy.log('🔹 Step 2: Reading created post...');
        PostService.getPostById(createdPostId).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.id).to.eq(createdPostId);
          cy.log('✅ Post read successfully');
        });
      });

      // UPDATE
      cy.then(() => {
        cy.log('🔹 Step 3: Updating post...');
        const updatedData = {
          ...newPost,
          title: 'Updated Title',
          id: createdPostId
        };
        
        PostService.updatePost(createdPostId, updatedData).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.title).to.eq('Updated Title');
          cy.log('✅ Post updated successfully');
        });
      });

      // DELETE
      cy.then(() => {
        cy.log('🔹 Step 4: Deleting post...');
        PostService.deletePost(createdPostId).then((response) => {
          expect(response.status).to.eq(200);
          cy.log('✅ Post deleted successfully');
        });
      });
    });

  });

});

