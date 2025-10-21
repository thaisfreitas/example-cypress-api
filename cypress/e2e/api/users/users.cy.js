/**
 * Testes de API - Users Endpoint
 * @tags @api @users @regression
 */

const UserService = require('../../../services/UserService');
const { userSchema, usersArraySchema } = require('../../../schemas/userSchema');
const APIHelper = require('../../../support/api-helper');

describe('API Tests - Users Endpoint', () => {
  
  describe('GET /users', { tags: ['@smoke', '@regression'] }, () => {
    
    it('Deve retornar todos os usuários', () => {
      UserService.getAllUsers().then((response) => {
        // Validações básicas
        expect(response.status).to.eq(200);
        APIHelper.validateCommonHeaders(response);
        
        // Validar estrutura da resposta
        UserService.validateUsersList(response.body);
        
        // Validar que temos pelo menos 10 usuários
        expect(response.body.length).to.be.at.least(10);
        
        // Validar schema JSON
        cy.wrap(response.body).validateSchema(usersArraySchema);
        
        // Log detalhado
        APIHelper.logResponse(response, 'Get All Users');
      });
    });

    it('Deve retornar tempo de resposta menor que 2 segundos', () => {
      UserService.getAllUsers().then((response) => {
        cy.validateResponseTime(response, 2000);
      });
    });

  });

  describe('GET /users/:id', { tags: ['@smoke', '@regression'] }, () => {
    
    it('Deve retornar um usuário específico por ID', () => {
      const userId = 1;
      
      UserService.getUserById(userId).then((response) => {
        expect(response.status).to.eq(200);
        
        // Validar estrutura
        UserService.validateUserStructure(response.body);
        
        // Validar ID correto
        expect(response.body.id).to.eq(userId);
        
        // Validar schema
        cy.wrap(response.body).validateSchema(userSchema);
      });
    });

    it('Deve retornar 404 para usuário inexistente', () => {
      UserService.getUserById(999999, 404).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it('Deve validar estrutura completa do usuário', () => {
      UserService.getUserById(1).then((response) => {
        const user = response.body;
        
        // Validar campos obrigatórios
        expect(user).to.have.all.keys(
          'id', 'name', 'username', 'email', 
          'address', 'phone', 'website', 'company'
        );
        
        // Validar endereço
        expect(user.address).to.have.property('street');
        expect(user.address).to.have.property('city');
        expect(user.address).to.have.property('zipcode');
        
        // Validar empresa
        expect(user.company).to.have.property('name');
        expect(user.company).to.have.property('catchPhrase');
      });
    });

  });

  describe('POST /users', { tags: ['@regression'] }, () => {
    
    it('Deve criar um novo usuário', () => {
      const newUser = APIHelper.generateFakeUser();
      
      UserService.createUser(newUser).then((response) => {
        expect(response.status).to.eq(201);
        
        // Validar que retornou um ID
        expect(response.body).to.have.property('id');
        
        // Validar que os dados foram salvos
        expect(response.body.name).to.eq(newUser.name);
        expect(response.body.email).to.eq(newUser.email);
        
        cy.log(`✅ User created with ID: ${response.body.id}`);
      });
    });

    it('Deve criar usuário usando fixture', () => {
      cy.fixture('users').then((usersData) => {
        UserService.createUser(usersData.validUser).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('id');
        });
      });
    });

  });

  describe('PUT /users/:id', { tags: ['@regression'] }, () => {
    
    it('Deve atualizar um usuário existente', () => {
      const userId = 1;
      const updatedData = {
        id: userId,
        name: 'Updated Name',
        username: 'updated_username',
        email: 'updated@example.com'
      };
      
      UserService.updateUser(userId, updatedData).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq(updatedData.name);
        expect(response.body.email).to.eq(updatedData.email);
      });
    });

  });

  describe('PATCH /users/:id', { tags: ['@regression'] }, () => {
    
    it('Deve atualizar parcialmente um usuário', () => {
      const userId = 1;
      const partialData = {
        name: 'Partially Updated Name'
      };
      
      UserService.patchUser(userId, partialData).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq(partialData.name);
      });
    });

  });

  describe('DELETE /users/:id', { tags: ['@regression'] }, () => {
    
    it('Deve deletar um usuário', () => {
      const userId = 1;
      
      UserService.deleteUser(userId).then((response) => {
        expect(response.status).to.eq(200);
        cy.log(`✅ User ${userId} deleted successfully`);
      });
    });

  });

  describe('Nested Resources', { tags: ['@regression'] }, () => {
    
    it('Deve retornar posts de um usuário específico', () => {
      const userId = 1;
      
      UserService.getUserPosts(userId).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        
        // Validar que todos os posts pertencem ao usuário
        response.body.forEach(post => {
          expect(post.userId).to.eq(userId);
        });
      });
    });

    it('Deve retornar todos os TODOs de um usuário', () => {
      const userId = 1;
      
      UserService.getUserTodos(userId).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);
        
        // Validar estrutura dos TODOs
        response.body.forEach(todo => {
          expect(todo).to.have.property('id');
          expect(todo).to.have.property('title');
          expect(todo).to.have.property('completed');
          expect(todo.userId).to.eq(userId);
        });
      });
    });

  });

  describe('Data Validation', { tags: ['@regression'] }, () => {
    
    it('Deve validar formato de email', () => {
      UserService.getAllUsers().then((response) => {
        response.body.forEach(user => {
          expect(user.email).to.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
        });
      });
    });

    it('Deve validar que IDs são únicos', () => {
      UserService.getAllUsers().then((response) => {
        const ids = response.body.map(user => user.id);
        const uniqueIds = [...new Set(ids)];
        
        expect(ids.length).to.eq(uniqueIds.length);
      });
    });

  });

  describe('Performance Tests', { tags: ['@performance'] }, () => {
    
    it('Deve carregar lista de usuários em menos de 1 segundo', () => {
      const startTime = new Date().getTime();
      
      UserService.getAllUsers().then((response) => {
        const endTime = new Date().getTime();
        const duration = endTime - startTime;
        
        cy.log(`⏱️ Request duration: ${duration}ms`);
        expect(duration).to.be.lessThan(1000);
      });
    });

  });

});

