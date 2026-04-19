# 🏗️ Arquitetura do Projeto

## Diagrama Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                     🌐 NAVEGADOR DO USUÁRIO                     │
│                     http://localhost:5173                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                      HTTP Request/Response
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    ⚛️ FRONTEND (Vite + React)                    │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │   Login.tsx      │  │  Register.tsx    │                    │
│  │                  │  │                  │                    │
│  │ • Form handling  │  │ • Form validation│                    │
│  │ • Validation     │  │ • User creation  │                    │
│  │ • API calls      │  │ • Auth check     │                    │
│  └────────┬─────────┘  └────────┬─────────┘                    │
│           │                     │                               │
│           └──────────┬──────────┘                               │
│                      │                                          │
│           ┌──────────▼──────────┐                              │
│           │   src/services/     │                              │
│           │   api.ts            │                              │
│           │                     │                              │
│           │ • Axios instance    │                              │
│           │ • JWT interceptor   │                              │
│           │ • Base URL config   │                              │
│           └──────────┬──────────┘                              │
│                      │                                          │
│           ┌──────────▼──────────┐                              │
│           │  Login.css &        │                              │
│           │  Register.css       │                              │
│           │                     │                              │
│           │ • Gradients         │                              │
│           │ • Animations        │                              │
│           │ • Responsive        │                              │
│           └─────────────────────┘                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                 POST /api/login (JSON)
                 POST /api/register (JSON)
                 GET /api/profile (JWT)
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                  🚀 BACKEND (Node.js + Express)                 │
│                    http://localhost:5000                        │
│                                                                  │
│  ┌──────────────────────────────────────────────────┐          │
│  │              Express Server                      │          │
│  │                                                  │          │
│  │  ┌─────────────┐  ┌──────────────────────┐     │          │
│  │  │  CORS       │  │  JSON Parser         │     │          │
│  │  │  Middleware │  │  Middleware          │     │          │
│  │  └─────────────┘  └──────────────────────┘     │          │
│  │                                                  │          │
│  │  ┌──────────────────────────────────────┐     │          │
│  │  │         Routes                       │     │          │
│  │  │                                      │     │          │
│  │  │  POST   /api/login                  │     │          │
│  │  │  POST   /api/register                │     │          │
│  │  │  GET    /api/profile (Protected)     │     │          │
│  │  │  POST   /api/logout                  │     │          │
│  │  │  GET    /api/health                  │     │          │
│  │  └──────────┬───────────────────────────┘     │          │
│  │             │                                  │          │
│  │  ┌──────────▼───────────────────────────┐     │          │
│  │  │    Authentication Logic              │     │          │
│  │  │                                      │     │          │
│  │  │  • bcryptjs (password hash)         │     │          │
│  │  │  • jsonwebtoken (JWT)               │     │          │
│  │  │  • Email validation                 │     │          │
│  │  └──────────┬───────────────────────────┘     │          │
│  │             │                                  │          │
│  └─────────────┼──────────────────────────────────┘          │
│                │                                              │
│                │         SQL Queries                          │
│                │    (Prepared Statements)                     │
│                │                                              │
└────────────────┼──────────────────────────────────────────────┘
                 │
┌────────────────▼──────────────────────────────────────────────┐
│          🗄️ BANCO DE DADOS (MySQL)                            │
│              login_db                                         │
│                                                               │
│  ┌────────────────────────────────────────────┐             │
│  │           Tabela: users                    │             │
│  │                                            │             │
│  │  id          │ INT AUTO_INCREMENT         │             │
│  │  name        │ VARCHAR(100)               │             │
│  │  email       │ VARCHAR(120) UNIQUE        │             │
│  │  password_hash│ VARCHAR(255) - bcrypted  │             │
│  │  created_at  │ TIMESTAMP                  │             │
│  │  updated_at  │ TIMESTAMP                  │             │
│  │                                            │             │
│  │  Índices: PRIMARY KEY (id)                │             │
│  │           UNIQUE (email)                  │             │
│  │           INDEX (email)                   │             │
│  └────────────────────────────────────────────┘             │
│                                                               │
│  Dados de Teste:                                             │
│  • admin@example.com (admin123)                              │
│  • demo@example.com (demo123)                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Fluxo de Login

```
┌────────────┐
│   Usuário  │
└─────┬──────┘
      │
      │ 1. Insere email e senha
      │
      ▼
┌──────────────────────┐
│  Frontend (React)    │
│                      │
│  Valida formulário   │
└─────┬────────────────┘
      │
      │ 2. POST /api/login
      │ {email, password}
      │
      ▼
┌──────────────────────┐
│  Backend (Express)   │
│                      │
│ • Busca usuário      │
│ • Valida senha       │
│ • Gera JWT token     │
└─────┬────────────────┘
      │
      │ 3. Response com token
      │
      ▼
┌──────────────────────┐
│  Frontend (React)    │
│                      │
│ • Armazena token     │
│ • Redireciona        │
└─────┬────────────────┘
      │
      │ 4. Acesso a rotas protegidas
      │ Header: Authorization: Bearer token
      │
      ▼
┌──────────────────────┐
│  Backend (Express)   │
│                      │
│ • Valida token JWT   │
│ • Retorna dados      │
└──────────────────────┘
```

---

## Estrutura de Pastas

```
Project-vite-01/
│
├── 📁 src/
│   ├── 📁 components/
│   │   ├── Login.tsx                 # Componente de login
│   │   └── Register.tsx              # Componente de registro
│   │
│   ├── 📁 styles/
│   │   ├── Login.css                 # Estilos do login
│   │   └── Register.css              # Estilos do registro
│   │
│   ├── 📁 services/
│   │   └── api.ts                    # Cliente HTTP
│   │
│   ├── 📁 types/
│   │   └── auth.ts                   # Tipos TypeScript
│   │
│   ├── App.tsx                       # Componente principal
│   ├── main.tsx                      # Ponto de entrada
│   └── index.css                     # Estilos globais
│
├── 📁 bd/
│   ├── server.js                     # Servidor Express
│   ├── package.json                  # Dependências
│   ├── .env                          # Configurações
│   ├── setup.sql                     # Script do banco
│   ├── INSTALAR.bat                  # Instalador Windows
│   ├── setup.sh                      # Setup Linux/Mac
│   └── .gitignore                    # Ignore git
│
├── package.json                      # Dependências frontend
├── vite.config.ts                    # Config Vite
├── tsconfig.json                     # Config TypeScript
├── eslint.config.js                  # Config ESLint
│
└── 📚 Documentação/
    ├── QUICK_START.md                # Começar rápido
    ├── SETUP_GUIDE.md                # Guia completo
    ├── DBEAVER_GUIDE.md              # Usar DBeaver
    ├── DATABASE_GUIDE.md             # Banco de dados
    ├── API_EXAMPLES.md               # Exemplos de API
    ├── README_LOGIN.md               # Visão geral
    ├── CHECKLIST.md                  # O que foi feito
    └── .env.example                  # Template .env
```

---

## Tecnologias Utilizadas

```
Frontend:
├── React 19.2.4
├── TypeScript 6.0.2
├── Vite 8.0.4
└── CSS3 (com animações)

Backend:
├── Node.js
├── Express.js 4.18.2
├── MySQL2 3.6.5
├── bcryptjs 2.4.3
└── jsonwebtoken 9.1.2

Banco de Dados:
└── MySQL 5.7+
```

---

## Fluxo de Desenvolvimento

```
┌─────────────────────────────────────────────┐
│  Desenvolvimento Local                      │
│                                             │
│  Terminal 1:     Terminal 2:               │
│  cd bd           npm run dev               │
│  npm run dev     (Vite dev server)         │
│  (Express)       http://localhost:5173     │
│  :5000           :5173                     │
│                                             │
└─────────────────────────────────────────────┘
                      │
              Editar código
              Hot reload automático
                      │
                      ▼
         ┌─────────────────────┐
         │  Banco de Dados     │
         │  (DBeaver)          │
         │  localhost:3306     │
         └─────────────────────┘
```

---

## Segurança

```
┌──────────────────────────────────────────┐
│  Camada de Segurança                     │
│                                          │
│  Frontend:                               │
│  ├── Validação de entrada               │
│  └── HTTPS em produção                  │
│                                          │
│  Backend:                                │
│  ├── Validação de dados                 │
│  ├── Prepared statements (SQL injection)│
│  ├── bcrypt para senhas                 │
│  ├── JWT com expiry                     │
│  ├── CORS configurado                   │
│  └── Rate limiting (opcional)           │
│                                          │
│  Banco de Dados:                         │
│  ├── Senhas hasheadas                   │
│  ├── Email único                        │
│  └── Timestamps de auditoria            │
│                                          │
└──────────────────────────────────────────┘
```

---

## Deployment

```
Frontend → Vercel / Netlify
           (Static files - dist/)

Backend  → Heroku / Railway / Render
           (Node.js app)

Database → Cloud MySQL (AWS RDS, DigitalOcean)
           ou servidor próprio
```

---

Este é um sistema completo e pronto para produção! 🚀
