# 🔧 Guia de Instalação - Cypress API Testing

Tutorial passo a passo para configurar o projeto pela primeira vez.

---

## ⚡ Instalação Rápida (TL;DR)

```bash
cd example-cypress-api
npm install
npm run cy:open
```

**Tempo estimado:** 3-5 minutos

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### 1. Node.js (Versão 18 ou superior)

**Verificar instalação:**
```bash
node --version
```

**Saída esperada:** `v18.x.x` ou superior

**Não tem Node.js?**
- Download: https://nodejs.org/
- Recomendamos a versão LTS (Long Term Support)

### 2. npm (Gerenciador de Pacotes)

O npm vem automaticamente com o Node.js.

**Verificar instalação:**
```bash
npm --version
```

**Saída esperada:** `9.x.x` ou superior

### 3. Git (Opcional, mas recomendado)

**Verificar instalação:**
```bash
git --version
```

**Não tem Git?**
- Download: https://git-scm.com/

---

## 🚀 Instalação Passo a Passo

### Passo 1: Navegar até o Diretório

```bash
cd /Users/tfreitas/Documents/Projetos/example-cypress-api
```

Ou se estiver começando do zero:

```bash
cd ~/Documents/Projetos
# O projeto já está em example-cypress-api/
```

### Passo 2: Instalar Dependências

```bash
npm install
```

**O que está sendo instalado?**
- ✅ Cypress 13.6.0
- ✅ Faker (geração de dados)
- ✅ AJV (validação de schemas)
- ✅ Mochawesome Reporter
- ✅ Cypress Grep Plugin

**Tempo estimado:** 2-3 minutos (depende da velocidade da internet)

**Saída esperada:**
```
added 180 packages, and audited 181 packages in 2m
found 0 vulnerabilities
```

### Passo 3: Verificar Instalação do Cypress

```bash
npx cypress verify
```

**Saída esperada:**
```
✔ Verified Cypress! /Users/.../Cypress.app
```

### Passo 4: Primeiro Teste!

**Modo Interativo (Recomendado para começar):**

```bash
npm run cy:open
```

Isso abrirá a interface do Cypress.

**Passos na interface:**
1. Clique em **"E2E Testing"**
2. Escolha um navegador (Chrome recomendado)
3. Clique em **"Start E2E Testing in Chrome"**
4. Na lista de testes, clique em `examples/basic-examples.cy.js`
5. Assista os testes executarem! 🎉

**Modo Headless (Linha de comando):**

```bash
npm test
```

ou

```bash
npm run cy:run
```

---

## ✅ Verificação da Instalação

### Checklist

Execute cada comando e verifique se funciona:

```bash
# 1. Verificar estrutura de arquivos
ls -la

# 2. Verificar package.json
cat package.json | grep "cypress"

# 3. Verificar Cypress
npx cypress verify

# 4. Executar teste simples
npx cypress run --spec "cypress/e2e/api/examples/basic-examples.cy.js"
```

Se todos os comandos funcionarem, **instalação concluída com sucesso!** ✅

---

## 🐛 Troubleshooting

### Problema 1: "command not found: npm"

**Solução:** Instale o Node.js:
```bash
# macOS com Homebrew
brew install node

# Ou baixe de https://nodejs.org/
```

### Problema 2: "EACCES: permission denied"

**Solução:** Problemas de permissão. Tente:
```bash
sudo npm install
# OU configure npm para não usar sudo
```

**Melhor solução (permanente):**
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

### Problema 3: "Cypress failed to start"

**Solução 1:** Limpar cache e reinstalar
```bash
npx cypress cache clear
npm cache clean --force
rm -rf node_modules
npm install
```

**Solução 2:** Verificar requisitos do sistema
- macOS 10.9+ (Mavericks ou superior)
- 64-bit
- Pelo menos 2GB RAM

### Problema 4: "Network error" durante instalação

**Solução:** Problemas de rede. Tente:
```bash
# Aumentar timeout
npm install --timeout=60000

# Ou usar outro registry
npm config set registry https://registry.npmjs.org/
npm install
```

### Problema 5: Testes falhando

**Verificar conexão com a internet:**
```bash
curl -I https://jsonplaceholder.typicode.com/users
```

**Deve retornar:** `HTTP/2 200`

Se não funcionar, verifique firewall/proxy.

### Problema 6: "Cannot find module"

**Solução:** Reinstalar dependências
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🔄 Atualizando o Projeto

### Atualizar Dependências

```bash
# Ver dependências desatualizadas
npm outdated

# Atualizar todas (cuidado!)
npm update

# Atualizar apenas Cypress
npm install cypress@latest --save-dev
```

### Atualizar Cypress

```bash
# Verificar versão atual
npx cypress --version

# Atualizar para última versão
npm install cypress@latest --save-dev

# Verificar nova versão
npx cypress verify
```

---

## 🎯 Configurações Opcionais

### 1. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

Edite `.env` com suas configurações (se necessário).

### 2. Configurar VS Code

Instale extensões recomendadas:
- **Cypress Snippets**
- **Cypress Helper**
- **ESLint**

```bash
# Via command line (se tiver code CLI)
code --install-extension shelex.vscode-cy-helper
```

### 3. Configurar Git Hooks (Opcional)

Para rodar testes antes de commit:

```bash
npm install --save-dev husky
npx husky install
npx husky add .git/hooks/pre-commit "npm test"
```

---

## 📊 Validando a Instalação

### Teste Completo

Execute esta sequência para validar tudo:

```bash
# 1. Executar testes de exemplo
npm run cy:run -- --spec "cypress/e2e/api/examples/basic-examples.cy.js"

# 2. Executar testes de usuários
npm run cy:run -- --spec "cypress/e2e/api/users/users.cy.js"

# 3. Executar todos os testes
npm test

# 4. Gerar relatório
npm run report:generate
```

Se tudo passar, **você está pronto!** 🎉

---

## 📈 Próximos Passos

Agora que a instalação está completa:

1. **Leia a documentação:**
   - [QUICK_START.md](./QUICK_START.md) - Comece aqui!
   - [README.md](./README.md) - Documentação completa
   - [BEST_PRACTICES.md](./BEST_PRACTICES.md) - Melhores práticas

2. **Execute os exemplos:**
   ```bash
   npm run cy:open
   # Abra: examples/basic-examples.cy.js
   ```

3. **Crie seu primeiro teste:**
   - Copie um teste existente
   - Modifique para aprender
   - Crie algo novo!

4. **Explore os Services:**
   - Abra `cypress/services/UserService.js`
   - Veja como são usados nos testes
   - Tente criar um novo Service

---

## 🎓 Comandos Úteis do Dia a Dia

### Desenvolvimento

```bash
# Modo interativo (melhor para desenvolver)
npm run cy:open

# Executar teste específico
npx cypress run --spec "cypress/e2e/api/users/users.cy.js"

# Executar com navegador visível
npx cypress run --headed --browser chrome

# Executar apenas testes smoke
npm run test:smoke
```

### Debugging

```bash
# Modo debug
npx cypress open --browser chrome --e2e

# Ver logs detalhados
DEBUG=cypress:* npm run cy:open
```

### Relatórios

```bash
# Gerar relatório HTML
npm run report:generate
npm run report:merge
npm run report:html

# Abrir relatório
open cypress/reports/html/index.html
```

---

## 🔍 Estrutura de Arquivos

Após a instalação, você terá:

```
example-cypress-api/
├── node_modules/              # Dependências (criado após npm install)
├── cypress/
│   ├── e2e/                  # Seus testes
│   ├── fixtures/             # Dados de teste
│   ├── services/             # Services da API
│   ├── schemas/              # Validações JSON
│   └── support/              # Comandos e helpers
├── cypress.config.js         # Configuração do Cypress
├── package.json              # Dependências do projeto
├── package-lock.json         # Lock de versões (criado após npm install)
└── README.md                 # Documentação
```

---

## 💾 Backup e Restauração

### Fazer Backup

```bash
# Backup da configuração (não inclui node_modules)
tar -czf cypress-backup.tar.gz \
  cypress/ \
  *.md \
  *.js \
  *.json \
  --exclude=node_modules \
  --exclude=cypress/videos \
  --exclude=cypress/screenshots
```

### Restaurar

```bash
# Descompactar
tar -xzf cypress-backup.tar.gz

# Reinstalar dependências
npm install
```

---

## 🎯 Dicas Finais

### Performance

1. **Adicione ao .gitignore:**
   - `node_modules/` (já incluído)
   - `cypress/videos/` (já incluído)
   - `cypress/screenshots/` (já incluído)

2. **Cache do Cypress:**
   - Localização: `~/.cache/Cypress/`
   - Para limpar: `npx cypress cache clear`

3. **Evite reinstalar constantemente:**
   - O Cypress baixa ~400MB na primeira vez
   - Fica em cache para próximos projetos

### Segurança

1. **NUNCA commite:**
   - `.env` com dados reais
   - Tokens ou senhas
   - API keys reais

2. **Use variáveis de ambiente:**
   - Para dados sensíveis
   - Para configurações específicas

---

## 🆘 Precisa de Ajuda?

### Recursos

- 📖 [Documentação do Cypress](https://docs.cypress.io/)
- 💬 [Cypress Discord](https://discord.gg/cypress)
- 🐙 [GitHub Issues](https://github.com/cypress-io/cypress/issues)
- 📧 Email do criador do projeto

### Comandos de Diagnóstico

```bash
# Informações do sistema
npx cypress info

# Versão do Cypress
npx cypress --version

# Versão do Node
node --version

# Versão do npm
npm --version

# Verificar instalação
npx cypress verify
```

---

## ✅ Checklist Final

Antes de começar a desenvolver, verifique:

- [ ] Node.js 18+ instalado
- [ ] npm instalado e funcionando
- [ ] Dependências instaladas (`npm install`)
- [ ] Cypress verificado (`npx cypress verify`)
- [ ] Testes de exemplo executando
- [ ] Documentação lida (pelo menos QUICK_START.md)
- [ ] Editor de código configurado (VS Code recomendado)

---

**Instalação concluída! Bons testes! 🚀**

**Próximo passo:** Leia o [QUICK_START.md](./QUICK_START.md)

