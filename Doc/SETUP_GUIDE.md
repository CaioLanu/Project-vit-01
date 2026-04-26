# 🚀 Login Futurista com Banco de Dados

Um sistema de autenticação moderno e futurista com interface visual incrível e conexão com banco de dados MySQL usando DBeaver.

## 📋 Requisitos

- **Node.js** (v16 ou superior)
- **MySQL** (v5.7 ou superior) ou MariaDB
- **DBeaver** (opcional, para gerenciar o banco de dados)
- **npm** ou **yarn**

## 📁 Estrutura do Projeto

```
Project-vite-01/
├── src/
│   ├── components/
│   │   ├── Login.tsx          # Componente de Login
│   │   └── Register.tsx       # Componente de Registro
│   ├── styles/
│   │   ├── Login.css          # Estilos do Login
│   │   └── Register.css       # Estilos do Registro
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── bd/
│   ├── server.js              # Backend Node.js/Express
│   ├── package.json           # Dependências backend
│   ├── .env                   # Variáveis de ambiente
│   └── setup.sql              # Script para criar banco de dados
├── package.json               # Dependências frontend
└── vite.config.ts            # Configuração Vite
```

## 🔧 Configuração

### 1. **Preparar o Banco de Dados**

#### Opção A: Usando MySQL CLI
```bash
mysql -u root -p < bd/setup.sql
```

#### Opção B: Usando DBeaver
1. Abra o DBeaver
2. Crie uma nova conexão MySQL
   - Host: `localhost`
   - Port: `3306`
   - Username: `root`
   - Password: (deixe em branco ou sua senha)
3. Abra um novo script SQL
4. Copie o conteúdo de `bd/setup.sql` e execute

**Credenciais de teste:**
- Email: `admin@example.com` | Senha: `admin123`
- Email: `demo@example.com` | Senha: `demo123`

### 2. **Configurar Backend**

```bash
# Entrar no diretório do backend
cd bd

# Instalar dependências
npm install

# Editar .env com suas configurações
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=sua_senha (se houver)
# DB_NAME=login_db

# Iniciar o servidor
npm start
# Ou em modo desenvolvimento com hot reload
npm run dev
```

O servidor iniciará em `http://localhost:5000`

### 3. **Configurar Frontend**

```bash
# Na raiz do projeto
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

A aplicação iniciará em `http://localhost:5173`

## 🎨 Características

### Login
- ✨ Interface futurista com gradientes e animações
- 🎯 Validação de formulário
- 🔐 Autenticação JWT
- 📧 Verificação de email no banco de dados
- 🔒 Passwords com bcrypt
- 💬 Mensagens de erro/sucesso animadas

### Registro
- 👤 Criar nova conta de usuário
- ✔️ Validação de senha
- 🚫 Verificação de email duplicado
- 🎨 Mesma estética futurista

### Backend
- 🗄️ Conexão com MySQL
- 🔑 JWT para autenticação
- 🔐 Bcrypt para hash de senhas
- 🛡️ Middleware de autenticação
- 📡 API RESTful

## 📡 Endpoints da API

### Login
```bash
POST /api/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response (Sucesso):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com"
  }
}
```

### Registro
```bash
POST /api/register
Content-Type: application/json

{
  "name": "Novo Usuário",
  "email": "novo@example.com",
  "password": "senha123"
}
```

### Perfil (Requer Autenticação)
```bash
GET /api/profile
Authorization: Bearer seu_token_jwt
```

### Logout
```bash
POST /api/logout
```

### Health Check
```bash
GET /api/health
```

## 🌐 Conexão com DBeaver

1. **Criar Conexão:**
   - Abra DBeaver → New Database Connection
   - Escolha MySQL
   - Configure:
     - Server Host: `localhost`
     - Port: `3306`
     - Database: `login_db`
     - Username: `root`
     - Password: (sua senha)
   - Clique em "Finish"

2. **Explorar Banco de Dados:**
   - Expand `login_db` → `Tables`
   - Você verá a tabela `users`
   - Clique direito na tabela para ver os dados

3. **Executar Queries:**
   - Right-click na conexão → SQL Editor → New SQL Query
   - Cole suas queries SQL

## 🔐 Segurança

- **Senhas**: Todas as senhas são hashidas com bcrypt (cost factor: 10)
- **JWT**: Tokens válidos por 24 horas
- **CORS**: Configurado para aceitar requisições do frontend
- **Validação**: Validação no frontend e backend
- **SQL Injection**: Prevenido com prepared statements

## 🚀 Deployment

### Frontend (Vercel, Netlify)
```bash
npm run build
# Fazer deploy da pasta 'dist'
```

### Backend (Heroku, Railway, Render)
```bash
# Certifique-se que as variáveis de ambiente estão configuradas
git push heroku main
```

## 🐛 Troubleshooting

### "Conexão recusada ao banco de dados"
- Verifique se MySQL está rodando
- Confira as credenciais em `bd/.env`
- Verifique se o banco `login_db` foi criado

### "Erro CORS"
- Certifique-se que o backend está rodando em `http://localhost:5000`
- Verifique se `cors` está configurado corretamente

### "Token inválido"
- O token pode ter expirado (24h)
- Faça login novamente para obter um novo token

## 📚 Tecnologias Utilizadas

### Frontend
- React 19.2.4
- TypeScript
- Vite
- CSS3 (Gradientes, Animações, Backdrop Filter)

### Backend
- Node.js
- Express.js
- MySQL2/Promise
- JWT (jsonwebtoken)
- bcryptjs

## 📝 Variáveis de Ambiente

**Backend (`bd/.env`):**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=login_db
DB_PORT=3306
JWT_SECRET=seu-segredo-super-secreto-mude-em-producao
PORT=5000
```

## 🎯 Próximos Passos

- [ ] Implementar "Esqueceu Senha"
- [ ] Adicionar autenticação social (Google, GitHub)
- [ ] Dashboard protegido
- [ ] Refresh tokens
- [ ] Rate limiting
- [ ] Testes automatizados
- [ ] Docker setup

## 📄 Licença

Este projeto está disponível para uso livre e pessoal.

## 💡 Dicas

1. **Desenvolvimento**: Use `npm run dev` no frontend para hot reload
2. **Backend**: Use `npm run dev` no backend para watching com nodemon
3. **DBeaver**: Ideal para gerenciar dados e executar queries complexas
4. **JWT**: Guarde o token JWT no localStorage ou sessionStorage
5. **HTTPS**: Use HTTPS em produção

---

**Criado com ❤️ para uma experiência futurista**
