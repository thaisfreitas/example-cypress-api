/**
 * Testes de API - Todos Endpoint
 * @tags @api @todos @regression
 */

const TodoService = require('../../../services/TodoService');
const { todoSchema, todosArraySchema } = require('../../../schemas/todoSchema');
const APIHelper = require('../../../support/api-helper');

describe('API Tests - Todos Endpoint', () => {
  
  describe('GET /todos', { tags: ['@smoke', '@regression'] }, () => {
    
    it('Deve retornar todos os TODOs', () => {
      TodoService.getAllTodos().then((response) => {
        expect(response.status).to.eq(200);
        TodoService.validateTodosList(response.body);
        expect(response.body.length).to.be.at.least(200);
        
        // Validar schema
        cy.wrap(response.body).validateSchema(todosArraySchema);
      });
    });

  });

  describe('GET /todos/:id', { tags: ['@smoke', '@regression'] }, () => {
    
    it('Deve retornar um TODO específico', () => {
      const todoId = 1;
      
      TodoService.getTodoById(todoId).then((response) => {
        expect(response.status).to.eq(200);
        TodoService.validateTodoStructure(response.body);
        expect(response.body.id).to.eq(todoId);
        
        // Validar schema
        cy.wrap(response.body).validateSchema(todoSchema);
      });
    });

  });

  describe('POST /todos', { tags: ['@regression'] }, () => {
    
    it('Deve criar um novo TODO', () => {
      const newTodo = APIHelper.generateFakeTodo();
      
      TodoService.createTodo(newTodo).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body.title).to.eq(newTodo.title);
        expect(response.body.completed).to.eq(newTodo.completed);
        
        cy.log(`✅ TODO created with ID: ${response.body.id}`);
      });
    });

    it('Deve criar TODO usando fixture', () => {
      cy.fixture('todos').then((todosData) => {
        TodoService.createTodo(todosData.validTodo).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body.completed).to.eq(false);
        });
      });
    });

  });

  describe('PUT /todos/:id', { tags: ['@regression'] }, () => {
    
    it('Deve atualizar um TODO', () => {
      const todoId = 1;
      const updatedTodo = {
        id: todoId,
        title: 'Updated TODO',
        completed: true,
        userId: 1
      };
      
      TodoService.updateTodo(todoId, updatedTodo).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.title).to.eq(updatedTodo.title);
        expect(response.body.completed).to.eq(true);
      });
    });

  });

  describe('PATCH /todos/:id', { tags: ['@regression'] }, () => {
    
    it('Deve marcar TODO como completo', () => {
      const todoId = 1;
      
      TodoService.completeTodo(todoId).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.completed).to.eq(true);
        cy.log('✅ TODO marked as completed');
      });
    });

  });

  describe('DELETE /todos/:id', { tags: ['@regression'] }, () => {
    
    it('Deve deletar um TODO', () => {
      const todoId = 1;
      
      TodoService.deleteTodo(todoId).then((response) => {
        expect(response.status).to.eq(200);
        cy.log(`✅ TODO ${todoId} deleted successfully`);
      });
    });

  });

  describe('Query Parameters', { tags: ['@regression'] }, () => {
    
    it('Deve filtrar TODOs por userId', () => {
      const userId = 1;
      
      TodoService.getTodosByUserId(userId).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        
        response.body.forEach(todo => {
          expect(todo.userId).to.eq(userId);
        });
      });
    });

    it('Deve filtrar TODOs completados', () => {
      TodoService.getCompletedTodos().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        
        response.body.forEach(todo => {
          expect(todo.completed).to.eq(true);
        });
        
        cy.log(`✅ Found ${response.body.length} completed TODOs`);
      });
    });

    it('Deve filtrar TODOs pendentes', () => {
      TodoService.getPendingTodos().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        
        response.body.forEach(todo => {
          expect(todo.completed).to.eq(false);
        });
        
        cy.log(`✅ Found ${response.body.length} pending TODOs`);
      });
    });

  });

  describe('Statistics', { tags: ['@regression'] }, () => {
    
    it('Deve calcular estatísticas de TODOs por usuário', () => {
      const userId = 1;
      
      TodoService.getTodosByUserId(userId).then((response) => {
        const todos = response.body;
        const completed = todos.filter(t => t.completed === true).length;
        const pending = todos.filter(t => t.completed === false).length;
        const total = todos.length;
        const completionRate = (completed / total * 100).toFixed(2);
        
        cy.log(`📊 User ${userId} Statistics:`);
        cy.log(`   Total: ${total}`);
        cy.log(`   Completed: ${completed}`);
        cy.log(`   Pending: ${pending}`);
        cy.log(`   Completion Rate: ${completionRate}%`);
        
        expect(total).to.be.greaterThan(0);
        expect(completed + pending).to.eq(total);
      });
    });

  });

});

