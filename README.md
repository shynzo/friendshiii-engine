# Friendshii 🤫🤫🎁

Uma API completa e eficiente para gerenciar sorteios de amigo secreto digitalmente. Desenvolvida como solução para um desafio de backend, esta API oferece uma maneira moderna de organizar grupos e realizar sorteios com segurança e confiabilidade.

## 💡 Sobre o Projeto

Este projeto oferece uma solução digital para organização de amigos secretos, permitindo criar grupos, gerenciar participantes e realizar sorteios de forma segura e automatizada. Com o Friendshii, você pode:

- ✅ Criar e gerenciar grupos de amigo secreto
- 👥 Adicionar e remover participantes
- 🎲 Realizar sorteios de forma justa e automática 
- 🔒 Garantir que cada pessoa só veja quem ela mesma tirou
- 📅 Definir data do evento e orçamento para presentes
- 🛡️ Autenticação segura via tokens JWT

## 🚀 Tecnologias Utilizadas

### 🫓 Bun
- Runtime JavaScript/TypeScript moderno e eficiente
- Gerenciador de pacotes com excelente performance
- Execução de testes e bundling nativos
- Compatibilidade com Node.js
- Performance superior para aplicações modernas

### 🗃️ bun-sqlite
- Driver SQLite otimizado para Bun
- Alta performance em operações de banco de dados
- Integração nativa com o ecossistema
- Solução ideal para aplicações que precisam de banco local

### 🎭 Drizzle ORM
- ORM TypeScript-first com suporte nativo ao Bun
- Schema type-safe para maior segurança
- Sistema de migrations confiável
- Query builder intuitivo
- Integração com Zod para validação de dados

### 🔥 Elysia
- Framework web moderno e eficiente
- Suporte nativo a TypeScript
- Sistema de middlewares robusto
- Validação de dados integrada
- Excelente performance

## 🏗️ Arquitetura do Sistema

O projeto segue uma arquitetura em camadas:

- 🖥️ **Handlers**: Interface com o cliente via API REST
- ⚙️ **Services**: Implementação da lógica de negócio
- 📊 **Repositories**: Abstração do acesso ao banco de dados
- 🧠 **Domain**: Modelos e regras de negócio
- 🛠️ **Lib**: Utilitários e helpers comuns

## 📦 Funcionalidades

- 👤 Gerenciamento de usuários
- 👪 Criação e administração de grupos
- ➕ Adição de participantes
- 🎯 Sorteio de usuários de um grupo
- 🔍 Consulta de pares sorteados
- 🔐 Autenticação via token
- 💾 Persistência via SQLite

## 🚦 Endpoints

### Grupos
```
POST /groups - Criar novo grupo
POST /groups/:groupId/add - Adicionar participante ao grupo
POST /groups/:groupId/draw - Realizar sorteio
GET /groups/:groupId - Obter informações do grupo
```

### Usuários
```
POST /users - Criar novo usuário
GET /users/:id - Obter informações do usuário
GET /users/:id/groups - Listar grupos do usuário
GET /users/:id/group/:groupId/match - Consultar seu amigo secreto
```

### Autenticação
```
POST /login - Solicitar token de login via email
POST /verify - Verificar token e autenticar
POST /refresh - Renovar token de acesso
POST /logout - Encerrar sessão
```

## 🛠 Como Executar

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/friendshii.git
cd friendshii
```

2. Instale as dependências:
```bash
bun install
```

3. Configure o banco de dados:
```bash
bun db:push
```

4. Inicie o servidor de desenvolvimento:
```bash
bun dev
```

5. Para produção:
```bash
bun build
bun start
```

## 🐳 Docker

Para executar com Docker:

```bash
docker build -t friendshii .
docker run -p 3000:3000 friendshii
```

## 📝 Requisitos

- Bun 1.0+ instalado
- Node.js 20+ (para compatibilidade de algumas dependências)
- SQLite

## 🧪 Testes

Execute os testes com:

```bash
bun test
```

## 📚 Documentação

Acesse a documentação Swagger em:
```
http://localhost:3000/docs
```

## 📄 Licença

Este projeto está licenciado sob a licença MIT.