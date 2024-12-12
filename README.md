# Secret Santa API 🎁

Uma API simples e eficiente para gerenciar sorteios de amigo secreto digitalmente. Desenvolvida como solução para um desafio de backend iniciante, esta API oferece uma maneira prática de organizar grupos e realizar sorteios.

## 💡 Sobre o Projeto

Este projeto oferece uma solução digital para organização de amigos secretos, permitindo criar grupos, gerenciar participantes e realizar sorteios de forma segura e automatizada. Ideal para desenvolvedores iniciantes que buscam praticar conceitos de backend com um projeto prático e útil.

## 🚀 Tecnologias Utilizadas

### 🫓 Bun
- Runtime JavaScript/TypeScript moderno e eficiente
- Gerenciador de pacotes com excelente performance
- Execução de testes e bundling nativos
- Compatibilidade com Node.js
- Performance superior para aplicações modernas

### bun-sqlite
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

### 🔥 Hono
- Framework web moderno e eficiente
- Suporte nativo a TypeScript
- Sistema de middlewares robusto
- Validação de dados integrada
- Excelente performance

## 📦 Funcionalidades

- Gerenciamento de usuários
- Criação e administração de grupos
- Adição de participantes
- Sorteio de usuários de um grupo
- Consulta de pares sorteados

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

## 🛠 Como Executar

1. Clone o repositório
2. Instale as dependências:
```bash
bun install
```

3. Configure o banco de dados:
```bash
bun db:push
```

4. Inicie o servidor:
```bash
bun dev
```

## 📝 Requisitos

- Bun instalado
- Node.js 20+ (para compatibilidade de algumas dependências)