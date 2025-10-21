# 🎯 Melhores Práticas - Testes de API com Cypress

Este guia apresenta as melhores práticas para criar e manter testes de API eficientes, confiáveis e escaláveis usando Cypress.

---

## 📑 Índice

1. [Organização de Código](#organização-de-código)
2. [Estrutura de Testes](#estrutura-de-testes)
3. [Nomenclatura](#nomenclatura)
4. [Validações e Asserções](#validações-e-asserções)
5. [Gerenciamento de Dados](#gerenciamento-de-dados)
6. [Tratamento de Erros](#tratamento-de-erros)
7. [Performance e Otimização](#performance-e-otimização)
8. [Segurança](#segurança)
9. [Manutenibilidade](#manutenibilidade)
10. [CI/CD](#cicd)

---

## 🗂️ Organização de Código

### ✅ Boas Práticas

#### 1. Use o Padrão Service/Helper
```javascript
// ❌ NÃO FAÇA - Request direto no teste
cy.request({
  method: 'GET',
  url: 'https://jsonplaceholder.typicode.com/users',
  headers: { 'Content-Type': 'application/json' }
})

// ✅ FAÇA - Use Services
UserService.getAllUsers()
```

**Por quê?**
- Reutilização de código
- Manutenção centralizada
- Facilita mudanças de endpoints
- Melhora a legibilidade dos testes

#### 2. Organize por Domínio/Recurso
```
cypress/
├── e2e/
│   └── api/
│       ├── users/           # Testes de usuários
│       ├── posts/           # Testes de posts
│       ├── comments/        # Testes de comentários
│       └── integration/     # Testes de integração
├── services/
│   ├── BaseService.js       # Serviço base
│   ├── UserService.js       # Serviço de usuários
│   └── PostService.js       # Serviço de posts
├── schemas/
│   ├── userSchema.js        # Schema de validação
│   └── postSchema.js
└── fixtures/
    ├── users.json           # Dados de teste
    └── posts.json
```

#### 3. Mantenha um Serviço Base
```javascript
// BaseService.js
class BaseService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  request(method, endpoint, options = {}) {
    return cy.request({
      method,
      url: `${this.baseUrl}${endpoint}`,
      failOnStatusCode: false,
      ...options
    })
  }
}
```

**Benefícios:**
- Configurações compartilhadas (headers, timeout, auth)
- Interceptação global de requests
- Logging centralizado
- Tratamento de erros consistente

---

## 🧪 Estrutura de Testes

### ✅ Padrão AAA (Arrange, Act, Assert)

```javascript
describe('API Users - GET /users/:id', () => {
  it('deve retornar usuário específico com sucesso', () => {
    // ARRANGE - Preparação
    const userId = 1
    
    // ACT - Ação
    UserService.getUserById(userId).then(response => {
      
      // ASSERT - Verificação
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('id', userId)
      expect(response.body).to.have.property('name')
      expect(response.body).to.have.property('email')
    })
  })
})
```

### ✅ Estrutura de Describe e Context

```javascript
describe('API Posts', () => {
  
  context('GET /posts', () => {
    it('deve retornar lista de posts')
    it('deve retornar array não vazio')
    it('deve validar schema de cada post')
  })
  
  context('GET /posts/:id', () => {
    it('deve retornar post específico quando ID válido')
    it('deve retornar 404 quando ID não existe')
  })
  
  context('POST /posts', () => {
    it('deve criar novo post com dados válidos')
    it('deve retornar 400 quando dados inválidos')
  })
  
  context('PUT /posts/:id', () => {
    it('deve atualizar post existente')
    it('deve retornar 404 quando ID não existe')
  })
  
  context('DELETE /posts/:id', () => {
    it('deve deletar post com sucesso')
    it('deve retornar 404 quando ID não existe')
  })
})
```

---

## 📝 Nomenclatura

### ✅ Nomes Descritivos e Claros

#### Testes
```javascript
// ❌ NÃO FAÇA
it('test user')
it('should work')
it('teste 1')

// ✅ FAÇA
it('deve retornar status 200 ao buscar usuário existente')
it('deve retornar erro 404 quando usuário não existe')
it('deve validar todos os campos obrigatórios do schema')
```

#### Variáveis
```javascript
// ❌ NÃO FAÇA
const res = UserService.getAllUsers()
const data = response.body
const x = 1

// ✅ FAÇA
const response = UserService.getAllUsers()
const users = response.body
const userId = 1
const expectedUserCount = 10
```

#### Métodos e Funções
```javascript
// ❌ NÃO FAÇA
getU()
createP()
validate()

// ✅ FAÇA
getUserById(userId)
createNewPost(postData)
validatePostSchema(response)
```

### ✅ Convenções

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| **Arquivos de Teste** | `recurso.cy.js` | `users.cy.js`, `posts.cy.js` |
| **Services** | `RecursoService.js` | `UserService.js`, `PostService.js` |
| **Schemas** | `recursoSchema.js` | `userSchema.js`, `postSchema.js` |
| **Fixtures** | `recurso.json` | `users.json`, `posts.json` |
| **Constantes** | `UPPER_SNAKE_CASE` | `BASE_URL`, `API_TIMEOUT` |
| **Variáveis** | `camelCase` | `userId`, `postData` |
| **Classes** | `PascalCase` | `UserService`, `ApiHelper` |

---

## ✔️ Validações e Asserções

### ✅ Valide Múltiplos Aspectos

#### 1. Status HTTP
```javascript
expect(response.status).to.eq(200)
expect(response.status).to.be.oneOf([200, 201])
```

#### 2. Headers
```javascript
expect(response.headers).to.have.property('content-type')
expect(response.headers['content-type']).to.include('application/json')
```

#### 3. Estrutura do Body
```javascript
expect(response.body).to.be.an('array')
expect(response.body).to.have.length.greaterThan(0)
expect(response.body[0]).to.have.all.keys('id', 'name', 'email')
```

#### 4. Tipos de Dados
```javascript
expect(response.body.id).to.be.a('number')
expect(response.body.name).to.be.a('string')
expect(response.body.active).to.be.a('boolean')
expect(response.body.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
```

#### 5. Valores Específicos
```javascript
expect(response.body.id).to.eq(1)
expect(response.body.status).to.eq('active')
expect(response.body.count).to.be.greaterThan(0)
```

### ✅ Use Schema Validation

```javascript
// schemas/userSchema.js
const userSchema = {
  type: 'object',
  required: ['id', 'name', 'email'],
  properties: {
    id: { type: 'number' },
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    username: { type: 'string' },
    phone: { type: 'string' },
    website: { type: 'string' }
  }
}

// No teste
import { validateSchema } from '../../../schemas/userSchema'

it('deve validar schema do usuário', () => {
  UserService.getUserById(1).then(response => {
    expect(response.status).to.eq(200)
    validateSchema(response.body)
  })
})
```

### ✅ Validações Específicas vs Genéricas

```javascript
// ❌ NÃO FAÇA - Muito genérico
expect(response.body).to.exist

// ✅ FAÇA - Específico e útil
expect(response.body).to.have.property('id')
expect(response.body.id).to.be.a('number')
expect(response.body.id).to.be.greaterThan(0)
```

---

## 💾 Gerenciamento de Dados

### ✅ Use Fixtures para Dados de Teste

```javascript
// cypress/fixtures/newUser.json
{
  "name": "Test User",
  "email": "test@example.com",
  "username": "testuser"
}

// No teste
cy.fixture('newUser').then(userData => {
  UserService.createUser(userData).then(response => {
    expect(response.status).to.eq(201)
  })
})
```

### ✅ Dados Dinâmicos vs Estáticos

```javascript
// ❌ NÃO FAÇA - Dados estáticos podem causar conflitos
const userData = {
  email: 'test@example.com',
  username: 'testuser'
}

// ✅ FAÇA - Dados dinâmicos evitam conflitos
const timestamp = Date.now()
const userData = {
  email: `test${timestamp}@example.com`,
  username: `testuser${timestamp}`
}

// OU use bibliotecas como Faker
import { faker } from '@faker-js/faker'

const userData = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  username: faker.internet.userName()
}
```

### ✅ Limpeza de Dados

```javascript
describe('API Posts', () => {
  let createdPostId
  
  afterEach(() => {
    // Limpa dados criados durante o teste
    if (createdPostId) {
      PostService.deletePost(createdPostId)
      createdPostId = null
    }
  })
  
  it('deve criar e deletar post', () => {
    const postData = { title: 'Test', body: 'Content' }
    
    PostService.createPost(postData).then(response => {
      createdPostId = response.body.id
      expect(response.status).to.eq(201)
    })
  })
})
```

### ✅ Evite Dependências entre Testes

```javascript
// ❌ NÃO FAÇA - Testes dependentes
describe('API Posts', () => {
  let postId
  
  it('deve criar post', () => {
    PostService.createPost(postData).then(response => {
      postId = response.body.id // Teste 2 depende disso
    })
  })
  
  it('deve buscar post criado', () => {
    PostService.getPostById(postId).then(response => {
      expect(response.status).to.eq(200)
    })
  })
})

// ✅ FAÇA - Testes independentes
describe('API Posts', () => {
  
  it('deve criar post', () => {
    PostService.createPost(postData).then(response => {
      expect(response.status).to.eq(201)
    })
  })
  
  it('deve buscar post existente', () => {
    const knownPostId = 1
    PostService.getPostById(knownPostId).then(response => {
      expect(response.status).to.eq(200)
    })
  })
})
```

---

## 🚨 Tratamento de Erros

### ✅ Teste Casos de Sucesso E Falha

```javascript
context('GET /users/:id', () => {
  
  it('deve retornar 200 quando usuário existe', () => {
    UserService.getUserById(1).then(response => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('id', 1)
    })
  })
  
  it('deve retornar 404 quando usuário não existe', () => {
    UserService.getUserById(999999).then(response => {
      expect(response.status).to.eq(404)
    })
  })
})
```

### ✅ Valide Mensagens de Erro

```javascript
it('deve retornar mensagem de erro adequada', () => {
  const invalidData = { title: '' } // título vazio
  
  PostService.createPost(invalidData).then(response => {
    expect(response.status).to.eq(400)
    expect(response.body).to.have.property('error')
    expect(response.body.error).to.include('title')
  })
})
```

### ✅ Use failOnStatusCode Adequadamente

```javascript
// No BaseService
request(method, endpoint, options = {}) {
  return cy.request({
    method,
    url: `${this.baseUrl}${endpoint}`,
    failOnStatusCode: false, // Permite testar erros
    ...options
  })
}

// Nos testes, você pode validar qualquer status
it('deve retornar 404', () => {
  UserService.getUserById(999999).then(response => {
    expect(response.status).to.eq(404)
  })
})
```

---

## ⚡ Performance e Otimização

### ✅ Execute Testes em Paralelo

```json
// cypress.config.js
{
  "e2e": {
    "experimentalMemoryManagement": true,
    "numTestsKeptInMemory": 10
  }
}
```

```bash
# Execute com múltiplos workers
npx cypress run --parallel --record --key=<key>
```

### ✅ Use Aliases para Evitar Duplicação

```javascript
// ❌ NÃO FAÇA
it('teste complexo', () => {
  UserService.getUserById(1).then(response => {
    expect(response.status).to.eq(200)
  })
  
  UserService.getUserById(1).then(response => {
    expect(response.body.name).to.exist
  })
})

// ✅ FAÇA
it('teste complexo', () => {
  UserService.getUserById(1).as('userResponse')
  
  cy.get('@userResponse').then(response => {
    expect(response.status).to.eq(200)
    expect(response.body.name).to.exist
  })
})
```

### ✅ Configure Timeouts Apropriados

```javascript
// cypress.config.js
{
  "e2e": {
    "responseTimeout": 10000,
    "requestTimeout": 10000,
    "defaultCommandTimeout": 10000
  }
}

// Por teste específico
it('teste que pode demorar', { requestTimeout: 30000 }, () => {
  UserService.getAllUsers().then(response => {
    expect(response.status).to.eq(200)
  })
})
```

### ✅ Evite Esperas Desnecessárias

```javascript
// ❌ NÃO FAÇA
cy.wait(5000)

// ✅ FAÇA - Cypress já espera automaticamente
UserService.getUserById(1).then(response => {
  expect(response.status).to.eq(200)
})
```

---

## 🔒 Segurança

### ✅ Nunca Exponha Credenciais

```javascript
// ❌ NÃO FAÇA
const apiKey = 'sk_live_12345abcde'

// ✅ FAÇA - Use variáveis de ambiente
// cypress.config.js
{
  "env": {
    "apiKey": process.env.API_KEY
  }
}

// No teste
const apiKey = Cypress.env('apiKey')
```

### ✅ Use .gitignore

```gitignore
# cypress/.gitignore
cypress.env.json
cypress/videos/
cypress/screenshots/
node_modules/
.env
*.log
```

### ✅ Sanitize Logs

```javascript
// ❌ NÃO FAÇA
cy.log('Token:', apiToken)

// ✅ FAÇA
cy.log('Token:', apiToken.substring(0, 5) + '...')
```

---

## 🔧 Manutenibilidade

### ✅ Documente Código Complexo

```javascript
/**
 * Valida o schema completo de um usuário
 * @param {Object} user - Objeto do usuário para validar
 * @param {boolean} checkAddress - Se deve validar endereço (opcional)
 * @returns {boolean} - True se válido
 * @throws {Error} - Se schema inválido
 */
function validateUserSchema(user, checkAddress = false) {
  // Validações...
}
```

### ✅ Use Constantes

```javascript
// cypress/support/constants.js
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
}

export const ENDPOINTS = {
  USERS: '/users',
  POSTS: '/posts',
  COMMENTS: '/comments'
}

// No teste
import { HTTP_STATUS, ENDPOINTS } from '../../support/constants'

expect(response.status).to.eq(HTTP_STATUS.OK)
```

### ✅ Mantenha Testes Pequenos e Focados

```javascript
// ❌ NÃO FAÇA - Teste fazendo muitas coisas
it('deve testar tudo', () => {
  // Cria usuário
  // Cria post
  // Adiciona comentário
  // Atualiza post
  // Deleta comentário
  // Deleta post
  // Deleta usuário
})

// ✅ FAÇA - Testes focados
it('deve criar usuário com sucesso')
it('deve criar post para usuário existente')
it('deve adicionar comentário em post existente')
it('deve atualizar post existente')
```

### ✅ Revise e Refatore Regularmente

- Remova testes duplicados
- Elimine código morto
- Atualize dependências
- Melhore nomenclaturas
- Otimize esperas e timeouts

---

## 🚀 CI/CD

### ✅ Configure para Ambientes Diferentes

```javascript
// cypress.config.js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000',
    env: {
      apiUrl: process.env.API_URL || 'https://jsonplaceholder.typicode.com'
    }
  }
})
```

### ✅ GitHub Actions

```yaml
# .github/workflows/cypress.yml
name: Cypress Tests

on: [push, pull_request]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Cypress run
        uses: cypress-io/github-action@v5
        with:
          build: npm run build
          start: npm start
          wait-on: 'http://localhost:3000'
          browser: chrome
          record: true
        env:
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
```

### ✅ Gere Relatórios

```bash
# Instale reporter
npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator

# Configure no cypress.config.js
{
  "reporter": "mochawesome",
  "reporterOptions": {
    "reportDir": "cypress/reports",
    "overwrite": false,
    "html": true,
    "json": true
  }
}
```

---

## 📊 Métricas de Qualidade

### ✅ O que Medir

1. **Cobertura de Testes**
   - Endpoints cobertos vs total
   - Casos de sucesso vs erro

2. **Confiabilidade**
   - Taxa de sucesso dos testes
   - Testes flaky (instáveis)

3. **Performance**
   - Tempo de execução total
   - Tempo médio por teste
   - Testes mais lentos

4. **Manutenibilidade**
   - Duplicação de código
   - Complexidade ciclomática
   - Linhas de código por teste

---

## 📚 Recursos e Referências

### Documentação Oficial
- [Cypress Docs](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress API](https://docs.cypress.io/api/table-of-contents)

### Ferramentas Úteis
- [Ajv](https://ajv.js.org/) - JSON Schema Validation
- [Faker.js](https://fakerjs.dev/) - Geração de dados fake
- [Mochawesome](https://www.npmjs.com/package/mochawesome) - Relatórios HTML

### Comunidade
- [Cypress Discord](https://discord.gg/cypress)
- [Cypress GitHub](https://github.com/cypress-io/cypress)
- [Cypress YouTube](https://www.youtube.com/c/Cypressio)

---

## ✅ Checklist de Qualidade

Use este checklist antes de fazer commit:

- [ ] Testes têm nomes descritivos
- [ ] Cada teste é independente
- [ ] Validações incluem status, headers e body
- [ ] Casos de erro são testados
- [ ] Código está organizado em services/helpers
- [ ] Sem credenciais hardcoded
- [ ] Sem esperas fixas (cy.wait com tempo)
- [ ] Dados de teste são dinâmicos ou em fixtures
- [ ] Código está documentado (quando necessário)
- [ ] Testes passam localmente
- [ ] Linter sem erros
- [ ] Commits seguem conventional commits

---

## 🎓 Conclusão

Seguir estas melhores práticas vai ajudar você a:

✅ Escrever testes mais confiáveis e manuteníveis  
✅ Reduzir tempo de debug  
✅ Facilitar onboarding de novos membros  
✅ Melhorar a qualidade geral do projeto  
✅ Aumentar a confiança no deployment  

**Lembre-se:** Boas práticas são diretrizes, não regras absolutas. Use seu julgamento e adapte conforme necessário para o seu contexto!

---

**Última atualização:** Outubro 2025  
**Versão:** 1.0.0

