# 🚀 Cypress API Testing - Projeto de Estudo

Projeto completo de automação de testes de API usando Cypress, criado para estudar testes e automação no contexto de microserviços.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Como Executar](#como-executar)
- [API de Teste](#api-de-teste)
- [Padrões e Arquitetura](#padrões-e-arquitetura)
- [Exemplos de Uso](#exemplos-de-uso)
- [Melhores Práticas](#melhores-práticas)
- [Recursos Avançados](#recursos-avançados)

---

## 🎯 Sobre o Projeto

Este projeto foi criado como um ambiente de estudo para relembrar e aplicar as melhores práticas de automação de testes de API com Cypress. Ele serve como preparação para trabalhar com projetos que envolvem múltiplos microsserviços.

### Objetivos

- ✅ Implementar testes de API automatizados usando Cypress
- ✅ Aplicar padrão Service Object (similar ao Page Object Pattern)
- ✅ Criar comandos customizados reutilizáveis
- ✅ Validar schemas JSON usando AJV
- ✅ Gerar dados de teste com Faker
- ✅ Organizar código seguindo melhores práticas
- ✅ Documentar processos e ferramentas

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **Cypress** | 13.6.0 | Framework de testes E2E e API |
| **Node.js** | 18+ | Runtime JavaScript |
| **Faker** | 8.3.1 | Geração de dados fake |
| **AJV** | 8.12.0 | Validação de JSON Schema |
| **Mochawesome** | 3.8.0 | Reports HTML |
| **@cypress/grep** | 4.0.1 | Filtrar testes por tags |

---

## 📁 Estrutura do Projeto

```
example-cypress-api/
├── cypress/
│   ├── e2e/
│   │   └── api/
│   │       ├── users/
│   │       │   └── users.cy.js         # Testes de usuários
│   │       ├── posts/
│   │       │   └── posts.cy.js         # Testes de posts
│   │       ├── comments/
│   │       │   └── comments.cy.js      # Testes de comentários
│   │       └── todos/
│   │           └── todos.cy.js         # Testes de TODOs
│   │
│   ├── services/
│   │   ├── BaseService.js              # Classe base para services
│   │   ├── UserService.js              # Service de usuários
│   │   ├── PostService.js              # Service de posts
│   │   ├── CommentService.js           # Service de comentários
│   │   └── TodoService.js              # Service de TODOs
│   │
│   ├── schemas/
│   │   ├── userSchema.js               # Schema JSON de usuários
│   │   ├── postSchema.js               # Schema JSON de posts
│   │   ├── commentSchema.js            # Schema JSON de comentários
│   │   └── todoSchema.js               # Schema JSON de TODOs
│   │
│   ├── fixtures/
│   │   ├── users.json                  # Dados de teste de usuários
│   │   ├── posts.json                  # Dados de teste de posts
│   │   ├── comments.json               # Dados de teste de comentários
│   │   └── todos.json                  # Dados de teste de TODOs
│   │
│   └── support/
│       ├── e2e.js                      # Configurações globais
│       ├── commands.js                 # Comandos customizados
│       └── api-helper.js               # Funções auxiliares
│
├── cypress.config.js                    # Configuração do Cypress
├── package.json                         # Dependências do projeto
└── README.md                            # Este arquivo
```

---

## 🔧 Instalação

### Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn

### Passos

1. **Clone ou navegue até o diretório do projeto:**

```bash
cd example-cypress-api
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Verifique a instalação:**

```bash
npx cypress verify
```

---

## ▶️ Como Executar

### Executar em Modo Interativo

```bash
npm run cy:open
```

### Executar Todos os Testes (Headless)

```bash
npm test
```

ou

```bash
npm run cy:run
```

### Executar em Navegadores Específicos

```bash
# Chrome
npm run cy:run:chrome

# Firefox
npm run cy:run:firefox

# Edge
npm run cy:run:edge
```

### Executar Apenas Testes de API

```bash
npm run test:api
```

### Executar por Tags

```bash
# Apenas testes de smoke
npm run test:smoke

# Apenas testes de regression
npm run test:regression
```

### Executar Testes Específicos

```bash
# Apenas testes de usuários
npx cypress run --spec "cypress/e2e/api/users/**/*.cy.js"

# Apenas testes de posts
npx cypress run --spec "cypress/e2e/api/posts/**/*.cy.js"
```

---

## 🌐 API de Teste

Este projeto utiliza a **JSONPlaceholder** - uma API REST fake gratuita para testes e prototipagem.

### Base URL
```
https://jsonplaceholder.typicode.com
```

### Endpoints Disponíveis

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/users` | GET, POST, PUT, PATCH, DELETE | Gerenciar usuários |
| `/posts` | GET, POST, PUT, PATCH, DELETE | Gerenciar posts |
| `/comments` | GET, POST, PUT, PATCH, DELETE | Gerenciar comentários |
| `/todos` | GET, POST, PUT, PATCH, DELETE | Gerenciar TODOs |

### Recursos Aninhados

```
GET /users/1/posts       # Posts do usuário 1
GET /users/1/todos       # TODOs do usuário 1
GET /posts/1/comments    # Comentários do post 1
```

### Query Parameters

```
GET /posts?userId=1      # Filtrar posts por usuário
GET /todos?completed=true # Filtrar TODOs completos
```

**Documentação completa:** https://jsonplaceholder.typicode.com/guide/

---

## 🏗️ Padrões e Arquitetura

### 1. Service Object Pattern

Similar ao Page Object Pattern para UI, o Service Object encapsula a lógica de interação com cada endpoint da API.

**Exemplo:**

```javascript
// UserService.js
class UserService extends BaseService {
  constructor() {
    super('/users');
  }

  getAllUsers() {
    return this.getAll();
  }

  getUserById(userId) {
    return this.getById(userId);
  }

  createUser(userData) {
    return this.post(userData);
  }
}
```

**Uso nos testes:**

```javascript
const UserService = require('../../../services/UserService');

it('Deve retornar todos os usuários', () => {
  UserService.getAllUsers().then((response) => {
    expect(response.status).to.eq(200);
  });
});
```

### 2. Comandos Customizados

Comandos reutilizáveis para operações comuns:

```javascript
// Uso simples
cy.apiGet('/users', 200);
cy.apiPost('/posts', postData, 201);
cy.apiPut('/users/1', userData, 200);
cy.apiDelete('/users/1', 200);

// Validação de schema
cy.wrap(response.body).validateSchema(userSchema);

// Validação de tempo de resposta
cy.validateResponseTime(response, 1000);
```

### 3. Validação de Schema JSON

Usando AJV para garantir que a estrutura da resposta está correta:

```javascript
const userSchema = {
  type: 'object',
  required: ['id', 'name', 'username', 'email'],
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' }
  }
};

cy.wrap(response.body).validateSchema(userSchema);
```

### 4. Fixtures para Dados de Teste

```javascript
cy.fixture('users').then((usersData) => {
  UserService.createUser(usersData.validUser);
});
```

### 5. Geração de Dados com Faker

```javascript
const APIHelper = require('../support/api-helper');

const fakeUser = APIHelper.generateFakeUser();
const fakePost = APIHelper.generateFakePost();
```

---

## 📚 Exemplos de Uso

### Exemplo 1: Teste Simples GET

```javascript
describe('GET /users', () => {
  it('Deve retornar lista de usuários', () => {
    cy.apiGet('/users', 200).then((response) => {
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
    });
  });
});
```

### Exemplo 2: Teste CRUD Completo

```javascript
describe('CRUD Flow', () => {
  it('Deve criar, ler, atualizar e deletar post', () => {
    const newPost = APIHelper.generateFakePost();
    let postId;

    // CREATE
    PostService.createPost(newPost).then((response) => {
      expect(response.status).to.eq(201);
      postId = response.body.id;
    });

    // READ
    cy.then(() => {
      PostService.getPostById(postId).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.id).to.eq(postId);
      });
    });

    // UPDATE
    cy.then(() => {
      const updatedData = { ...newPost, title: 'Updated' };
      PostService.updatePost(postId, updatedData).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    // DELETE
    cy.then(() => {
      PostService.deletePost(postId).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });
});
```

### Exemplo 3: Teste com Query Parameters

```javascript
it('Deve filtrar posts por userId', () => {
  const userId = 1;
  
  PostService.getPostsByUserId(userId).then((response) => {
    expect(response.status).to.eq(200);
    response.body.forEach(post => {
      expect(post.userId).to.eq(userId);
    });
  });
});
```

### Exemplo 4: Validação de Schema

```javascript
it('Deve validar schema do usuário', () => {
  UserService.getUserById(1).then((response) => {
    cy.wrap(response.body).validateSchema(userSchema);
  });
});
```

### Exemplo 5: Teste de Performance

```javascript
it('Deve responder em menos de 1 segundo', () => {
  UserService.getAllUsers().then((response) => {
    cy.validateResponseTime(response, 1000);
  });
});
```

---

## ✨ Melhores Práticas

### 1. Organização de Testes

- ✅ Organize testes por recurso (users, posts, etc.)
- ✅ Use `describe` para agrupar testes relacionados
- ✅ Use tags para categorizar testes (`@smoke`, `@regression`)
- ✅ Nomeie testes de forma descritiva

### 2. Services

- ✅ Crie um Service para cada endpoint
- ✅ Estenda `BaseService` para reutilizar código
- ✅ Encapsule validações específicas no Service
- ✅ Mantenha Services simples e focados

### 3. Validações

- ✅ Sempre valide o status code
- ✅ Valide a estrutura da resposta (schema)
- ✅ Valide headers importantes
- ✅ Valide tempo de resposta em testes críticos

### 4. Dados de Teste

- ✅ Use Faker para gerar dados dinâmicos
- ✅ Use Fixtures para dados estáticos/cenários específicos
- ✅ Não use dados hardcoded nos testes

### 5. Comandos Customizados

- ✅ Crie comandos para ações repetitivas
- ✅ Mantenha comandos genéricos e reutilizáveis
- ✅ Documente comandos customizados

### 6. Logs e Debugging

- ✅ Use `cy.log()` para pontos importantes
- ✅ Use `APIHelper.logResponse()` para ver detalhes
- ✅ Mantenha logs informativos mas concisos

---

## 🚀 Recursos Avançados

### 1. Retry Logic

O Cypress automaticamente tenta novamente comandos que falham:

```javascript
// cypress.config.js
retries: {
  runMode: 2,  // 2 retries em modo CI/CD
  openMode: 0  // 0 retries em modo interativo
}
```

### 2. Múltiplos Ambientes

Configure diferentes ambientes no `cypress.config.js`:

```javascript
env: {
  apiUrlDev: 'https://dev-api.example.com',
  apiUrlStaging: 'https://staging-api.example.com',
  apiUrlProd: 'https://api.example.com'
}
```

Execute com ambiente específico:

```bash
npx cypress run --env environment=staging
```

### 3. Autenticação

Para APIs que requerem autenticação:

```javascript
// Fazer login
cy.authenticate('username', 'password');

// Usar token nas requisições
cy.apiRequestAuth('GET', '/protected-endpoint');
```

### 4. Interceptação de Requests

```javascript
cy.intercept('GET', '/users/*', (req) => {
  // Modificar request
  req.headers['custom-header'] = 'value';
}).as('getUser');

cy.wait('@getUser');
```

### 5. Relatórios HTML

Gere relatórios visuais com Mochawesome:

```bash
npm run report:generate
npm run report:merge
npm run report:html
```

Os relatórios ficam em `cypress/reports/html/`.

---

## 🎓 Guia de Estudo

### Para QAs Iniciantes

1. **Comece com testes simples:**
   - Execute `users.cy.js` e analise o código
   - Modifique um teste existente
   - Crie um teste novo similar

2. **Entenda os Services:**
   - Abra `UserService.js` e veja os métodos
   - Compare com `BaseService.js`
   - Tente criar um novo método

3. **Pratique com diferentes endpoints:**
   - Comece com GET (mais simples)
   - Depois POST, PUT, PATCH
   - Por último DELETE

### Para QAs Intermediários

1. **Explore validações avançadas:**
   - Adicione novos schemas
   - Crie validações customizadas
   - Teste edge cases

2. **Crie fluxos complexos:**
   - Combine múltiplos endpoints
   - Teste dependências entre recursos
   - Implemente testes de integração

3. **Otimize performance:**
   - Adicione testes de carga
   - Meça tempos de resposta
   - Identifique gargalos

### Para QAs Avançados

1. **Implemente recursos avançados:**
   - Configure CI/CD
   - Adicione novos reporters
   - Integre com ferramentas de monitoramento

2. **Adapte para microsserviços:**
   - Configure múltiplas baseUrls
   - Implemente circuit breakers
   - Teste comunicação entre serviços

3. **Crie frameworks customizados:**
   - Desenvolva plugins próprios
   - Crie DSL para testes
   - Implemente padrões da empresa

---

## 🔗 Recursos Úteis

### Documentação Oficial
- [Cypress Docs](https://docs.cypress.io/)
- [Cypress API Commands](https://docs.cypress.io/api/table-of-contents)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/)

### Tutoriais e Cursos
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [API Testing with Cypress](https://learn.cypress.io/)

### Comunidade
- [Cypress Discord](https://discord.gg/cypress)
- [Cypress GitHub](https://github.com/cypress-io/cypress)

---

## 🤝 Contribuindo

Este é um projeto de estudo, mas sugestões são bem-vindas:

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

## 📝 Licença

MIT License - sinta-se livre para usar este projeto como desejar.

---

## 👨‍💻 Autor

**QA Senior** - Projeto de preparação para automação de microsserviços

---

## 📞 Suporte

Se tiver dúvidas ou sugestões, sinta-se à vontade para:
- Abrir uma issue
- Enviar um email
- Contribuir com melhorias

---

**Bons testes! 🚀**

