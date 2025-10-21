/**
 * Exemplos Básicos de Testes de API com Cypress
 * 
 * Este arquivo contém exemplos didáticos para iniciantes aprenderem
 * os conceitos fundamentais de testes de API.
 * 
 * @tags @examples @learning
 */

describe('Exemplos Básicos de Testes de API', { tags: ['@examples'] }, () => {
  
  // URL base da API de testes
  const baseUrl = 'https://jsonplaceholder.typicode.com';

  describe('1. Requisições GET Básicas', () => {
    
    it('Exemplo 1.1: GET simples', () => {
      cy.request('GET', `${baseUrl}/users`)
        .then((response) => {
          // Validar status code
          expect(response.status).to.eq(200);
          
          // Validar que recebemos um array
          expect(response.body).to.be.an('array');
          
          // Validar que o array não está vazio
          expect(response.body.length).to.be.greaterThan(0);
        });
    });

    it('Exemplo 1.2: GET com ID específico', () => {
      cy.request('GET', `${baseUrl}/users/1`)
        .then((response) => {
          expect(response.status).to.eq(200);
          
          // Validar estrutura do objeto
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('name');
          expect(response.body).to.have.property('email');
          
          // Validar valor específico
          expect(response.body.id).to.eq(1);
        });
    });

    it('Exemplo 1.3: GET com query parameters', () => {
      cy.request('GET', `${baseUrl}/posts?userId=1`)
        .then((response) => {
          expect(response.status).to.eq(200);
          
          // Validar que todos os posts pertencem ao userId 1
          response.body.forEach(post => {
            expect(post.userId).to.eq(1);
          });
        });
    });

  });

  describe('2. Requisições POST (Criar)', () => {
    
    it('Exemplo 2.1: Criar novo recurso', () => {
      const newPost = {
        title: 'Meu Primeiro Post',
        body: 'Este é o conteúdo do meu post',
        userId: 1
      };

      cy.request('POST', `${baseUrl}/posts`, newPost)
        .then((response) => {
          // POST geralmente retorna 201 (Created)
          expect(response.status).to.eq(201);
          
          // Validar que retornou um ID
          expect(response.body).to.have.property('id');
          
          // Validar que os dados foram salvos
          expect(response.body.title).to.eq(newPost.title);
          expect(response.body.body).to.eq(newPost.body);
        });
    });

    it('Exemplo 2.2: Criar e depois buscar', () => {
      const newUser = {
        name: 'João Silva',
        email: 'joao@example.com',
        username: 'joaosilva'
      };

      let createdId;

      // Criar
      cy.request('POST', `${baseUrl}/users`, newUser)
        .then((response) => {
          expect(response.status).to.eq(201);
          createdId = response.body.id;
        });

      // Buscar o que foi criado
      cy.then(() => {
        cy.request('GET', `${baseUrl}/users/${createdId}`)
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.id).to.eq(createdId);
          });
      });
    });

  });

  describe('3. Requisições PUT (Atualizar Completo)', () => {
    
    it('Exemplo 3.1: Atualizar recurso', () => {
      const updatedPost = {
        id: 1,
        title: 'Título Atualizado',
        body: 'Conteúdo atualizado',
        userId: 1
      };

      cy.request('PUT', `${baseUrl}/posts/1`, updatedPost)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.title).to.eq(updatedPost.title);
        });
    });

  });

  describe('4. Requisições PATCH (Atualizar Parcial)', () => {
    
    it('Exemplo 4.1: Atualizar apenas um campo', () => {
      const partialUpdate = {
        title: 'Apenas Título Novo'
      };

      cy.request('PATCH', `${baseUrl}/posts/1`, partialUpdate)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.title).to.eq(partialUpdate.title);
        });
    });

  });

  describe('5. Requisições DELETE (Deletar)', () => {
    
    it('Exemplo 5.1: Deletar recurso', () => {
      cy.request('DELETE', `${baseUrl}/posts/1`)
        .then((response) => {
          expect(response.status).to.eq(200);
        });
    });

  });

  describe('6. Validações de Headers', () => {
    
    it('Exemplo 6.1: Validar Content-Type', () => {
      cy.request('GET', `${baseUrl}/users`)
        .then((response) => {
          expect(response.headers['content-type'])
            .to.include('application/json');
        });
    });

    it('Exemplo 6.2: Enviar headers customizados', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/users`,
        headers: {
          'Accept': 'application/json',
          'X-Custom-Header': 'meu-valor'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

  });

  describe('7. Tratamento de Erros', () => {
    
    it('Exemplo 7.1: Validar erro 404', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/users/999999`,
        failOnStatusCode: false  // Não falhar automaticamente
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it('Exemplo 7.2: Validar múltiplos status codes possíveis', () => {
      cy.request({
        method: 'DELETE',
        url: `${baseUrl}/users/1`,
        failOnStatusCode: false
      }).then((response) => {
        // Aceitar tanto 200 quanto 204
        expect([200, 204]).to.include(response.status);
      });
    });

  });

  describe('8. Usando Aliases', () => {
    
    it('Exemplo 8.1: Salvar resposta com alias', () => {
      cy.request('GET', `${baseUrl}/users/1')
        .as('userData');

      cy.get('@userData').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.id).to.eq(1);
      });
    });

  });

  describe('9. Encadeamento de Requests', () => {
    
    it('Exemplo 9.1: Buscar usuário e seus posts', () => {
      let userId;

      // Primeiro, buscar um usuário
      cy.request('GET', `${baseUrl}/users/1')
        .then((response) => {
          userId = response.body.id;
          cy.log(`Usuário: ${response.body.name}`);
        });

      // Depois, buscar posts desse usuário
      cy.then(() => {
        cy.request('GET', `${baseUrl}/posts?userId=${userId}`)
          .then((response) => {
            expect(response.body).to.be.an('array');
            cy.log(`Posts encontrados: ${response.body.length}`);
          });
      });
    });

    it('Exemplo 9.2: Fluxo CRUD completo', () => {
      let todoId;

      // CREATE
      cy.log('1️⃣ Criando TODO...');
      cy.request('POST', `${baseUrl}/todos`, {
        title: 'Aprender Cypress',
        completed: false,
        userId: 1
      }).then((response) => {
        expect(response.status).to.eq(201);
        todoId = response.body.id;
        cy.log(`✅ TODO criado com ID: ${todoId}`);
      });

      // READ
      cy.then(() => {
        cy.log('2️⃣ Lendo TODO...');
        cy.request('GET', `${baseUrl}/todos/${todoId}`)
          .then((response) => {
            expect(response.status).to.eq(200);
            cy.log('✅ TODO lido com sucesso');
          });
      });

      // UPDATE
      cy.then(() => {
        cy.log('3️⃣ Atualizando TODO...');
        cy.request('PATCH', `${baseUrl}/todos/${todoId}`, {
          completed: true
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.completed).to.eq(true);
          cy.log('✅ TODO atualizado');
        });
      });

      // DELETE
      cy.then(() => {
        cy.log('4️⃣ Deletando TODO...');
        cy.request('DELETE', `${baseUrl}/todos/${todoId}`)
          .then((response) => {
            expect(response.status).to.eq(200);
            cy.log('✅ TODO deletado');
          });
      });
    });

  });

  describe('10. Validações Avançadas', () => {
    
    it('Exemplo 10.1: Validar formato de email', () => {
      cy.request('GET', `${baseUrl}/users`)
        .then((response) => {
          response.body.forEach(user => {
            expect(user.email).to.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
          });
        });
    });

    it('Exemplo 10.2: Validar array tem elementos únicos', () => {
      cy.request('GET', `${baseUrl}/users`)
        .then((response) => {
          const ids = response.body.map(user => user.id);
          const uniqueIds = [...new Set(ids)];
          
          expect(ids.length).to.eq(uniqueIds.length);
        });
    });

    it('Exemplo 10.3: Validar ordenação', () => {
      cy.request('GET', `${baseUrl}/users`)
        .then((response) => {
          const ids = response.body.map(user => user.id);
          
          // Verificar se IDs estão em ordem crescente
          for (let i = 1; i < ids.length; i++) {
            expect(ids[i]).to.be.greaterThan(ids[i - 1]);
          }
        });
    });

  });

  describe('11. Tempo de Resposta', () => {
    
    it('Exemplo 11.1: Medir duração da requisição', () => {
      cy.request('GET', `${baseUrl}/users')
        .then((response) => {
          cy.log(`⏱️ Tempo de resposta: ${response.duration}ms`);
          
          // Validar que respondeu em menos de 2 segundos
          expect(response.duration).to.be.lessThan(2000);
        });
    });

  });

  describe('12. Logs e Debugging', () => {
    
    it('Exemplo 12.1: Logs informativos', () => {
      cy.log('🚀 Iniciando teste...');
      
      cy.request('GET', `${baseUrl}/users/1')
        .then((response) => {
          cy.log(`✅ Status: ${response.status}`);
          cy.log(`👤 Usuário: ${response.body.name}`);
          cy.log(`📧 Email: ${response.body.email}`);
          cy.log(`⏱️ Tempo: ${response.duration}ms`);
        });
    });

  });

});

