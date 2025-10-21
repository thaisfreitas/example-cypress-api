/**
 * Teste de Integração - Fluxo Completo Usuário -> Posts -> Comentários
 * 
 * Este teste demonstra como testar um fluxo completo entre múltiplos endpoints,
 * simulando a interação real entre recursos da API.
 * 
 * @tags @integration @e2e @critical
 */

const UserService = require('../../../services/UserService');
const PostService = require('../../../services/PostService');
const CommentService = require('../../../services/CommentService');
const APIHelper = require('../../../support/api-helper');

describe('Integration Tests - User -> Post -> Comment Flow', { tags: ['@integration', '@e2e'] }, () => {
  
  describe('Fluxo Completo de Criação', () => {
    
    it('Deve criar usuário, post e comentário em sequência', () => {
      let createdUserId;
      let createdPostId;
      let createdCommentId;

      cy.log('🔹 Passo 1: Criar Usuário');
      const newUser = APIHelper.generateFakeUser();
      
      UserService.createUser(newUser).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        createdUserId = response.body.id;
        
        cy.log(`✅ Usuário criado: ID ${createdUserId}`);
        cy.log(`   Nome: ${response.body.name}`);
        cy.log(`   Email: ${response.body.email}`);
      });

      cy.then(() => {
        cy.log('🔹 Passo 2: Criar Post para o Usuário');
        const newPost = {
          ...APIHelper.generateFakePost(),
          userId: createdUserId
        };
        
        PostService.createPost(newPost).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('id');
          expect(response.body.userId).to.eq(createdUserId);
          createdPostId = response.body.id;
          
          cy.log(`✅ Post criado: ID ${createdPostId}`);
          cy.log(`   Título: ${response.body.title}`);
        });
      });

      cy.then(() => {
        cy.log('🔹 Passo 3: Criar Comentário no Post');
        const newComment = APIHelper.generateFakeComment();
        
        CommentService.createComment(createdPostId, newComment).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('id');
          expect(response.body.postId).to.eq(createdPostId);
          createdCommentId = response.body.id;
          
          cy.log(`✅ Comentário criado: ID ${createdCommentId}`);
        });
      });

      cy.then(() => {
        cy.log('🔹 Passo 4: Validar Integridade dos Dados');
        
        // Validar que o post pertence ao usuário correto
        PostService.getPostById(createdPostId).then((response) => {
          expect(response.body.userId).to.eq(createdUserId);
        });
        
        // Validar que o comentário pertence ao post correto
        CommentService.getCommentById(createdCommentId).then((response) => {
          expect(response.body.postId).to.eq(createdPostId);
        });
        
        cy.log('✅ Fluxo completo validado com sucesso!');
      });
    });

  });

  describe('Fluxo de Leitura Aninhada', () => {
    
    it('Deve buscar usuário e todos seus posts com comentários', () => {
      const userId = 1;
      let userPosts = [];
      
      cy.log('🔹 Passo 1: Buscar Usuário');
      UserService.getUserById(userId).then((response) => {
        expect(response.status).to.eq(200);
        const user = response.body;
        
        cy.log(`✅ Usuário encontrado: ${user.name}`);
        cy.log(`   Email: ${user.email}`);
        cy.log(`   Cidade: ${user.address.city}`);
      });

      cy.then(() => {
        cy.log('🔹 Passo 2: Buscar Posts do Usuário');
        UserService.getUserPosts(userId).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
          userPosts = response.body;
          
          cy.log(`✅ Encontrados ${userPosts.length} posts`);
          
          // Validar que todos os posts pertencem ao usuário
          userPosts.forEach(post => {
            expect(post.userId).to.eq(userId);
          });
        });
      });

      cy.then(() => {
        cy.log('🔹 Passo 3: Buscar Comentários de Cada Post');
        
        userPosts.slice(0, 3).forEach((post, index) => {
          PostService.getPostComments(post.id).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            
            cy.log(`✅ Post #${index + 1} (ID: ${post.id}): ${response.body.length} comentários`);
            
            // Validar que todos os comentários pertencem ao post
            response.body.forEach(comment => {
              expect(comment.postId).to.eq(post.id);
              expect(comment.email).to.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
            });
          });
        });
      });
    });

  });

  describe('Fluxo de Atualização em Cascata', () => {
    
    it('Deve atualizar usuário e validar impacto nos posts', () => {
      const userId = 1;
      const updatedUserData = {
        id: userId,
        name: 'Nome Atualizado',
        username: 'username_updated',
        email: 'updated@example.com'
      };

      cy.log('🔹 Passo 1: Buscar Estado Original dos Posts');
      let originalPosts;
      
      UserService.getUserPosts(userId).then((response) => {
        originalPosts = response.body;
        cy.log(`✅ Posts originais: ${originalPosts.length}`);
      });

      cy.then(() => {
        cy.log('🔹 Passo 2: Atualizar Usuário');
        
        UserService.updateUser(userId, updatedUserData).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.name).to.eq(updatedUserData.name);
          cy.log('✅ Usuário atualizado com sucesso');
        });
      });

      cy.then(() => {
        cy.log('🔹 Passo 3: Validar que Posts Ainda Existem');
        
        UserService.getUserPosts(userId).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.length).to.eq(originalPosts.length);
          
          cy.log('✅ Integridade dos posts mantida');
        });
      });
    });

  });

  describe('Fluxo de Deleção', () => {
    
    it('Deve deletar recursos em ordem hierárquica', () => {
      const userId = 1;
      const postId = 1;
      let commentIds = [];

      cy.log('🔹 Passo 1: Buscar Comentários do Post');
      
      PostService.getPostComments(postId).then((response) => {
        commentIds = response.body.map(c => c.id).slice(0, 2);
        cy.log(`✅ Encontrados ${commentIds.length} comentários para deletar`);
      });

      cy.then(() => {
        cy.log('🔹 Passo 2: Deletar Comentários');
        
        commentIds.forEach((commentId, index) => {
          CommentService.deleteComment(commentId).then((response) => {
            expect(response.status).to.eq(200);
            cy.log(`✅ Comentário ${index + 1} deletado`);
          });
        });
      });

      cy.then(() => {
        cy.log('🔹 Passo 3: Deletar Post');
        
        PostService.deletePost(postId).then((response) => {
          expect(response.status).to.eq(200);
          cy.log('✅ Post deletado');
        });
      });

      cy.then(() => {
        cy.log('🔹 Passo 4: Deletar Usuário');
        
        UserService.deleteUser(userId).then((response) => {
          expect(response.status).to.eq(200);
          cy.log('✅ Usuário deletado');
        });
      });

      cy.then(() => {
        cy.log('✅ Fluxo de deleção completo!');
      });
    });

  });

  describe('Validação de Relacionamentos', () => {
    
    it('Deve validar que posts e comentários estão relacionados corretamente', () => {
      const userId = 1;
      let userPosts = [];
      let totalComments = 0;

      cy.log('📊 Análise de Relacionamentos');

      // Buscar posts do usuário
      UserService.getUserPosts(userId).then((response) => {
        userPosts = response.body;
        cy.log(`📝 Usuário tem ${userPosts.length} posts`);
      });

      // Contar comentários em cada post
      cy.then(() => {
        userPosts.slice(0, 5).forEach((post) => {
          PostService.getPostComments(post.id).then((response) => {
            const commentCount = response.body.length;
            totalComments += commentCount;
            
            cy.log(`   Post ${post.id}: ${commentCount} comentários`);
            
            // Validar relacionamento
            response.body.forEach(comment => {
              expect(comment.postId).to.eq(post.id);
            });
          });
        });
      });

      cy.then(() => {
        cy.log(`📊 Total de comentários analisados: ${totalComments}`);
        expect(totalComments).to.be.greaterThan(0);
      });
    });

  });

  describe('Performance de Fluxos Complexos', () => {
    
    it('Deve executar fluxo completo em tempo aceitável', () => {
      const startTime = Date.now();
      const userId = 1;

      // Fluxo: User -> Posts -> Comments do primeiro post
      UserService.getUserById(userId).then(() => {
        return UserService.getUserPosts(userId);
      }).then((response) => {
        const firstPost = response.body[0];
        return PostService.getPostComments(firstPost.id);
      }).then(() => {
        const duration = Date.now() - startTime;
        
        cy.log(`⏱️ Fluxo completo executado em: ${duration}ms`);
        
        // Validar que o fluxo completo leva menos de 5 segundos
        expect(duration).to.be.lessThan(5000);
      });
    });

  });

  describe('Tratamento de Erros em Fluxo', () => {
    
    it('Deve lidar com erros em cascata', () => {
      const invalidUserId = 999999;
      const invalidPostId = 999999;

      cy.log('🔹 Testando tratamento de erros');

      // Tentar buscar usuário inválido
      UserService.getUserById(invalidUserId, 404).then((response) => {
        expect(response.status).to.eq(404);
        cy.log('✅ Erro de usuário tratado corretamente');
      });

      // Tentar buscar post inválido
      PostService.getPostById(invalidPostId, 404).then((response) => {
        expect(response.status).to.eq(404);
        cy.log('✅ Erro de post tratado corretamente');
      });

      // Tentar criar comentário em post inválido
      const comment = APIHelper.generateFakeComment();
      CommentService.createComment(invalidPostId, comment, 201).then((response) => {
        // JSONPlaceholder aceita qualquer postId, mas em API real validaria
        cy.log('⚠️ Nota: API de teste aceita qualquer postId');
      });
    });

  });

});

