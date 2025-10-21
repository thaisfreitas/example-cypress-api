/**
 * Testes de API - Comments Endpoint
 * @tags @api @comments @regression
 */

const CommentService = require('../../../services/CommentService');
const { commentSchema, commentsArraySchema } = require('../../../schemas/commentSchema');
const APIHelper = require('../../../support/api-helper');

describe('API Tests - Comments Endpoint', () => {
  
  describe('GET /comments', { tags: ['@smoke', '@regression'] }, () => {
    
    it('Deve retornar todos os comentários', () => {
      CommentService.getAllComments().then((response) => {
        expect(response.status).to.eq(200);
        CommentService.validateCommentsList(response.body);
        expect(response.body.length).to.be.at.least(500);
        
        // Validar schema
        cy.wrap(response.body).validateSchema(commentsArraySchema);
      });
    });

  });

  describe('GET /comments/:id', { tags: ['@smoke', '@regression'] }, () => {
    
    it('Deve retornar um comentário específico', () => {
      const commentId = 1;
      
      CommentService.getCommentById(commentId).then((response) => {
        expect(response.status).to.eq(200);
        CommentService.validateCommentStructure(response.body);
        expect(response.body.id).to.eq(commentId);
        
        // Validar schema
        cy.wrap(response.body).validateSchema(commentSchema);
      });
    });

  });

  describe('POST /comments', { tags: ['@regression'] }, () => {
    
    it('Deve criar um novo comentário', () => {
      const postId = 1;
      const newComment = APIHelper.generateFakeComment();
      
      CommentService.createComment(postId, newComment).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body.postId).to.eq(postId);
        
        cy.log(`✅ Comment created with ID: ${response.body.id}`);
      });
    });

    it('Deve validar email no comentário', () => {
      const postId = 1;
      const newComment = APIHelper.generateFakeComment();
      
      CommentService.createComment(postId, newComment).then((response) => {
        expect(response.body.email).to.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
      });
    });

  });

  describe('Query Parameters', { tags: ['@regression'] }, () => {
    
    it('Deve filtrar comentários por postId', () => {
      const postId = 1;
      
      CommentService.getCommentsByPostId(postId).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        
        // Validar que todos pertencem ao post
        response.body.forEach(comment => {
          expect(comment.postId).to.eq(postId);
        });
      });
    });

    it('Deve filtrar comentários por email', () => {
      const email = 'Eliseo@gardner.biz';
      
      CommentService.getCommentsByEmail(email).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        
        if (response.body.length > 0) {
          response.body.forEach(comment => {
            expect(comment.email).to.eq(email);
          });
        }
      });
    });

  });

  describe('Data Validation', { tags: ['@regression'] }, () => {
    
    it('Deve validar que todos os comentários têm email válido', () => {
      CommentService.getCommentsByPostId(1).then((response) => {
        response.body.forEach(comment => {
          expect(comment.email).to.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
        });
      });
    });

    it('Deve validar que comentários têm conteúdo', () => {
      CommentService.getCommentsByPostId(1).then((response) => {
        response.body.forEach(comment => {
          expect(comment.body).to.have.length.greaterThan(0);
          expect(comment.name).to.have.length.greaterThan(0);
        });
      });
    });

  });

});

