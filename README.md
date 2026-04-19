# ALIPEN - Sistema de Solicitações de Quentinhas

Este projeto é uma aplicação fullstack organizada em pastas separadas para facilitar o desenvolvimento e deploy de containers independentes:

- `database/` - Arquivos relacionados ao banco de dados MySQL
- `frontend/` - aplicação React + TypeScript + Vite
- `backend/` - API Node.js + Express + MySQL + Redis
- `md/` - documentação do projeto em arquivos Markdown

## Estrutura do projeto

- `database/`
  - `dockerfile` - Dockerfile para MySQL
  - `compose.yaml` - Configuração Docker Compose para o banco
  - `setup.sql` - Script de inicialização do banco

- `frontend/`
  - `src/` - código React da interface
  - `public/` - assets públicos
  - `package.json` - dependências e scripts do frontend
  - `vite.config.ts` - configuração do Vite

- `backend/`
  - `server.js` - servidor Express
  - `package.json` - dependências e scripts do backend
  - `compose.yaml` - Docker Compose com MySQL, Redis e API
  - `.env.example` - exemplo de configuração de ambiente

- `md/`
  - documentação e guias do projeto

## Como executar

### Opção 1: Containers separados (recomendado)

1. **Banco de dados:**
```bash
cd database
docker compose up -d
```

2. **Backend (API + Redis):**
```bash
cd ../backend
docker compose up --build
```

3. **Frontend (desenvolvimento local):**
```bash
cd ../frontend
npm run dev
```

### Opção 2: Tudo junto via backend
```bash
cd backend
docker compose up --build
```

## URLs de acesso

- **Frontend:** http://localhost:5173
- **API Backend:** http://localhost:8000/api
- **MySQL:** localhost:3306 (apenas interno aos containers)

## Instalação (para desenvolvimento local)

1. Instale dependências do frontend:
   ```bash
   cd frontend
   npm install
   ```

2. Instale dependências do backend:
   ```bash
   cd ../backend
   npm install
   ```

## Desenvolvimento

- O frontend usa Vite para hot-reload
- O backend usa Node.js com watch mode
- O banco MySQL persiste dados em volume Docker
- Certifique-se de que o Docker Desktop esteja rodando

### Backend

Dentro de `backend/`:
```bash
npm run dev
```

A API backend roda em `http://localhost:5000`.

## Scripts úteis na raiz

A partir do diretório raiz, você pode usar:

```bash
npm run dev        # Inicia o frontend
npm run dev:frontend
npm run dev:backend # Inicia o backend
npm run start      # Inicia o backend em modo normal
```

## Configuração do banco de dados

- Utilize `backend/setup.sql` para criar as tabelas e dados iniciais no MySQL.
- Copie `.env.example` para `.env` dentro de `backend/` e ajuste as variáveis de conexão do MySQL.

## Observações

- O frontend usa `react-router-dom` para roteamento.
- O backend usa `jsonwebtoken`, `bcryptjs` e `mysql2`.
- A documentação do projeto foi movida para `md/`.

## Recomendações

- Antes de rodar o backend, verifique se o MySQL está ativo.
- Se usar DBeaver, importe `backend/setup.sql` e atualize as credenciais no `.env`.

---

Se precisar, posso gerar também um README específico para o backend ou para o frontend.