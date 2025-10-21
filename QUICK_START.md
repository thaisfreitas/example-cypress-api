# ⚡ Guia de Início Rápido - Cypress API Testing

Guia prático para começar a usar o projeto em 5 minutos!

---

## 🚀 Setup Rápido

### 1. Instalar Dependências

```bash
cd example-cypress-api
npm install
```

⏱️ **Tempo:** ~2 minutos

---

### 2. Executar Primeiro Teste

```bash
npm run cy:open
```

1. Escolha **E2E Testing**
2. Selecione **Chrome** (ou seu navegador preferido)
3. Clique em `users.cy.js`
4. Assista os testes executarem! 🎉

⏱️ **Tempo:** ~1 minuto

---

## 📝 Seu Primeiro Teste

Crie um arquivo: `cypress/e2e/api/my-first-test.cy.js`

```javascript
describe('Meu Primeiro Teste de API', () => {
  
  it('Deve retornar lista de usuários', () => {
    cy.request('GET', 'https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        cy.log('✅ Sucesso! Encontrados ' + response.body.length + ' usuários');
      });
  });

});
```

**Execute:**

```bash
npx cypress run --spec "cypress/e2e/api/my-first-test.cy.js"
```

⏱️ **Tempo:** ~2 minutos

---

## 🎯 Evolua Seu Teste

### Versão 2: Usando Comandos Customizados

```javascript
describe('Meu Teste Melhorado', () => {
  
  it('Deve retornar lista de usuários', () => {
    cy.apiGet('/users', 200).then((response) => {
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
    });
  });

});
```

### Versão 3: Usando Services

```javascript
const UserService = require('../../services/UserService');

describe('Meu Teste Profissional', () => {
  
  it('Deve retornar lista de usuários', () => {
    UserService.getAllUsers().then((response) => {
      expect(response.status).to.eq(200);
      UserService.validateUsersList(response.body);
    });
  });

});
```

---

## 🧪 Comandos Essenciais

### Executar Testes

```bash
# Modo interativo (visualizar execução)
npm run cy:open

# Modo headless (linha de comando)
npm test

# Apenas testes smoke
npm run test:smoke

# Testes específicos
npx cypress run --spec "cypress/e2e/api/users/**/*.cy.js"
```

### Executar em Diferentes Navegadores

```bash
npm run cy:run:chrome    # Chrome
npm run cy:run:firefox   # Firefox
npm run cy:run:edge      # Edge
```

---

## 📚 Próximos Passos

### Nível Iniciante

1. ✅ Execute todos os testes existentes
2. ✅ Modifique um teste de `users.cy.js`
3. ✅ Crie um teste para buscar um post específico

**Exemplo:**

```javascript
const PostService = require('../../services/PostService');

describe('Posts Tests', () => {
  it('Deve buscar post por ID', () => {
    PostService.getPostById(1).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(1);
    });
  });
});
```

### Nível Intermediário

1. ✅ Crie um novo Service (ex: AlbumService)
2. ✅ Implemente validação de schema JSON
3. ✅ Crie um teste de fluxo CRUD completo

**Exemplo de Service:**

```javascript
const BaseService = require('./BaseService');

class AlbumService extends BaseService {
  constructor() {
    super('/albums');
  }

  getAllAlbums() {
    return this.getAll();
  }

  getAlbumById(id) {
    return this.getById(id);
  }
}

module.exports = new AlbumService();
```

### Nível Avançado

1. ✅ Configure múltiplos ambientes (dev, staging, prod)
2. ✅ Implemente testes de performance
3. ✅ Configure CI/CD com GitHub Actions
4. ✅ Crie relatórios customizados

---

## 🎓 Recursos de Aprendizado

### Arquivos Importantes

| Arquivo | O que você aprende |
|---------|-------------------|
| `cypress/support/commands.js` | Comandos customizados |
| `cypress/services/UserService.js` | Service Object Pattern |
| `cypress/e2e/api/posts/posts.cy.js` | Fluxo CRUD completo |
| `BEST_PRACTICES.md` | Melhores práticas detalhadas |

### Desafios Práticos

#### 🎯 Desafio 1: CRUD Básico

Crie testes para:
- ✅ Criar um comentário
- ✅ Buscar o comentário criado
- ✅ Atualizar o comentário
- ✅ Deletar o comentário

#### 🎯 Desafio 2: Validações

Valide que:
- ✅ Todos os emails de usuários são válidos
- ✅ IDs são únicos
- ✅ Campos obrigatórios existem

#### 🎯 Desafio 3: Testes Aninhados

- ✅ Buscar posts de um usuário específico
- ✅ Buscar comentários de cada post
- ✅ Validar que os dados estão relacionados corretamente

---

## ⚡ Dicas Rápidas

### Debugging

```javascript
// Pausar execução
cy.pause();

// Log customizado
cy.log('🔍 Verificando usuário...');

// Debug no console
cy.then(() => {
  debugger;
});
```

### Apenas um Teste

```javascript
// Execute apenas este teste
it.only('Deve executar apenas este', () => {
  // ...
});
```

### Pular um Teste

```javascript
// Pula este teste
it.skip('Não executar este', () => {
  // ...
});
```

### Variáveis de Ambiente

```javascript
// Acessar variável
const baseUrl = Cypress.env('apiUrlDev');

// Definir variável
Cypress.env('customVar', 'value');
```

---

## 🐛 Troubleshooting

### Problema: Testes estão falhando

```bash
# Limpar cache
npm cache clean --force
rm -rf node_modules
npm install

# Verificar Cypress
npx cypress verify
```

### Problema: Timeouts

Aumente o timeout no `cypress.config.js`:

```javascript
defaultCommandTimeout: 15000,
requestTimeout: 15000,
responseTimeout: 30000
```

### Problema: "Cannot find module"

Verifique os caminhos:

```javascript
// ✅ Caminho relativo correto
require('../../services/UserService')

// ❌ Caminho errado
require('../UserService')
```

---

## 📞 Precisa de Ajuda?

### Documentação
- 📖 [README.md](./README.md) - Documentação completa
- 📘 [BEST_PRACTICES.md](./BEST_PRACTICES.md) - Melhores práticas
- 🌐 [Cypress Docs](https://docs.cypress.io/)

### Comunidade
- 💬 [Cypress Discord](https://discord.gg/cypress)
- 🐙 [Cypress GitHub](https://github.com/cypress-io/cypress)

---

## ✅ Checklist de Progresso

Marque conforme avança:

### Setup
- [ ] Instalei as dependências
- [ ] Executei os testes existentes
- [ ] Todos os testes passaram

### Básico
- [ ] Criei meu primeiro teste
- [ ] Entendi como usar `cy.request()`
- [ ] Usei comandos customizados (`cy.apiGet`, etc)

### Intermediário
- [ ] Usei Services nos meus testes
- [ ] Criei um novo Service
- [ ] Implementei validação de schema

### Avançado
- [ ] Criei teste de fluxo completo
- [ ] Configurei diferentes ambientes
- [ ] Implementei testes de performance
- [ ] Configurei CI/CD

---

## 🎉 Parabéns!

Você está pronto para começar a automatizar testes de API com Cypress!

**Próximos passos sugeridos:**

1. Explore os testes existentes em `cypress/e2e/api/`
2. Leia o [BEST_PRACTICES.md](./BEST_PRACTICES.md)
3. Crie seus próprios testes
4. Adapte para seu projeto real de microsserviços

**Bom aprendizado! 🚀**

