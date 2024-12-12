# Use a imagem oficial do Bun
FROM oven/bun:latest

# Cria e define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package.json bun.lockb ./

# Instala as dependências
RUN bun install --frozen-lockfile

# Copia o resto dos arquivos do projeto
COPY . .

# Cria um diretório para o banco de dados SQLite
RUN mkdir -p /app/data

# Define uma variável de ambiente para o caminho do banco SQLite
ENV DATABASE_URL="/app/data/sqlite.db"

# Script para executar as migrações e iniciar a aplicação
RUN echo '#!/bin/sh\n\
bun run db:push\n\
bun run start' > /app/start.sh

RUN chmod +x /app/start.sh

# Expõe a porta que a aplicação utiliza
EXPOSE 3000

# Define o comando para iniciar a aplicação
CMD ["/app/start.sh"]