# 🎨 Sistema de Login Futurista com Banco de Dados

> ⚡ Uma aplicação web moderna com interface futurista para autenticação de usuários integrada com banco de dados MySQL usando DBeaver

## 🌟 Destaques

✨ **Design Futurista** - Interface moderna com animações suaves, gradientes e efeitos glow  
🔐 **Segurança em Primeiro Lugar** - JWT, bcrypt, proteção contra SQL Injection  
📱 **100% Responsivo** - Funciona perfeitamente em mobile, tablet e desktop  
🗄️ **Banco de Dados** - MySQL com integração completa  
📚 **Documentação Completa** - 10 guias em português  
🚀 **Pronto para Deploy** - Estrutura de produção  

---

## 🚀 Quick Start (3 Minutos)

### 1️⃣ Clonar e Instalar

```bash
# Instalar dependências
cd bd && npm install && cd .. && npm install

# Ou execute (Windows)
bd/INSTALAR.bat
```

### 2️⃣ Configurar Banco de Dados

```bash
# Opção 1: DBeaver (Recomendado)
# Abra bd/setup.sql no DBeaver e execute

# Opção 2: MySQL CLI
mysql -u root -p < bd/setup.sql
```

### 3️⃣ Iniciar Tudo

```bash
# Terminal 1: Backend
cd bd && npm run dev

# Terminal 2: Frontend
npm run dev
```

### 4️⃣ Acessar

```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

### 5️⃣ Testar

```
Email: admin@example.com
Senha: admin123
```

---

## 📚 Documentação

Cada arquivo tem um propósito específico:

| Documento | Para Quem | Tempo |
|-----------|-----------|-------|
| **[QUICK_START.md](./QUICK_START.md)** | Iniciantes | 2 min |
| **[FINAL_SUMMARY.md](./FINAL_SUMMARY.md)** | Visão geral completa | 5 min |
| **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** | Configuração detalhada | 15 min |
| **[DBEAVER_GUIDE.md](./DBEAVER_GUIDE.md)** | Como usar DBeaver | 10 min |
| **[DATABASE_GUIDE.md](./DATABASE_GUIDE.md)** | BD e queries SQL | 8 min |
| **[API_EXAMPLES.md](./API_EXAMPLES.md)** | Exemplos de API | 10 min |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Arquitetura do projeto | 8 min |
| **[VISUAL_MAP.md](./VISUAL_MAP.md)** | Onde encontrar tudo | 5 min |
| **[INDEX.md](./INDEX.md)** | Índice completo | 3 min |

---

## ✨ Features Implementadas

### 🎨 Frontend
- [x] Tela de Login com design futurista
- [x] Tela de Registro de usuários
- [x] Validação de formulário
- [x] Animações suaves
- [x] Responsividade total
- [x] Feedback visual
- [x] Integração com API

### 🚀 Backend
- [x] API RESTful completa
- [x] Autenticação com JWT
- [x] Hash de senha com bcrypt
- [x] Middleware de autenticação
- [x] CORS configurado
- [x] Tratamento de erros
- [x] Validação de entrada

### 🗄️ Banco de Dados
- [x] Criação automática
- [x] Estrutura otimizada
- [x] Índices para performance
- [x] Dados de teste inclusos
- [x] Script de setup

---

## 📁 O Que Você Tem

```
✅ Componentes React (Login & Register)
✅ Estilos CSS futuristas
✅ Backend Node.js + Express
✅ Banco de dados MySQL
✅ Autenticação JWT
✅ Validação completa
✅ Documentação em português
✅ Scripts de instalação
✅ Credenciais de teste
✅ Pronto para produção
```

---

## 🎯 Para Começar

### Novo no Projeto?
👉 Leia [QUICK_START.md](./QUICK_START.md) (2 minutos)

### Quer Configurar Tudo?
👉 Siga [SETUP_GUIDE.md](./SETUP_GUIDE.md) (15 minutos)

### Quer Entender a Arquitetura?
👉 Estude [ARCHITECTURE.md](./ARCHITECTURE.md) (8 minutos)

### Perdido? Não Sabe Aonde Encontrar?
👉 Veja [VISUAL_MAP.md](./VISUAL_MAP.md) - Mapa visual do projeto

---

## 🛠️ Tecnologias

### Frontend
- React 19.2.4
- TypeScript 6.0.2
- Vite 8.0.4
- CSS3 (com animações)

### Backend
- Node.js
- Express.js 4.18.2
- MySQL2 3.6.5
- bcryptjs 2.4.3
- jsonwebtoken 9.1.2

### Database
- MySQL 5.7+
- DBeaver (gerenciamento)

---

## 🔐 Segurança

✅ **Senhas** - Hashidas com bcrypt (cost: 10)  
✅ **Tokens** - JWT com expiração (24h)  
✅ **SQL** - Proteção contra injection (prepared statements)  
✅ **CORS** - Configurado para segurança  
✅ **Validação** - Frontend e backend  

---

## 🌐 Endpoints da API

```
POST   /api/login       - Fazer login
POST   /api/register    - Criar conta
GET    /api/profile     - Obter perfil (protegido)
POST   /api/logout      - Logout
GET    /api/health      - Health check
```

Veja exemplos em [API_EXAMPLES.md](./API_EXAMPLES.md)

---

## 🗄️ Estrutura do Banco de Dados

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(120) UNIQUE,
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 📊 Arquivo de Estrutura

```
Project-vite-01/
├── src/
│   ├── components/        # Componentes React
│   ├── styles/           # Estilos CSS
│   ├── services/         # Serviços (API)
│   ├── types/            # Tipos TypeScript
│   └── App.tsx
│
├── bd/
│   ├── server.js         # Backend Express
│   ├── setup.sql         # Script do banco
│   └── package.json      # Deps backend
│
├── 📚 Documentação (10 arquivos)
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🎓 Como Usar

### Desenvolvimento Local

```bash
# Terminal 1 - Backend
cd bd
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Build para Produção

```bash
npm run build
```

### Preview da Build

```bash
npm run preview
```

---

## 🚀 Deploy

### Frontend
- Vercel
- Netlify
- GitHub Pages

### Backend
- Heroku
- Railway
- Render

### Banco de Dados
- Cloud MySQL (AWS RDS)
- DigitalOcean
- Servidor próprio

Veja guia completo em [SETUP_GUIDE.md](./SETUP_GUIDE.md#-deployment)

---

## 🆘 Precisa de Ajuda?

| Problema | Solução |
|----------|---------|
| "Erro de conexão" | Veja TROUBLESHOOTING em SETUP_GUIDE.md |
| "Banco não conecta" | Leia DATABASE_GUIDE.md |
| "Como usar DBeaver" | Consulte DBEAVER_GUIDE.md |
| "Como chamar API" | Veja API_EXAMPLES.md |
| "Não entendo" | Leia ARCHITECTURE.md |
| "Não sei aonde vai" | Use VISUAL_MAP.md |

---

## 📊 Status

| Item | Status |
|------|--------|
| Frontend | ✅ Completo |
| Backend | ✅ Completo |
| Banco de Dados | ✅ Completo |
| Documentação | ✅ 100% |
| Segurança | ✅ Implementada |
| Testes | ✅ Credenciais inclusos |
| Deploy | ✅ Guia disponível |

---

## 🎁 Bônus Inclusos

- ✨ 10 documentos em português
- 🎨 Design premium
- 🔒 Segurança em produção
- 📱 100% responsivo
- 💻 Código limpo
- 🚀 Pronto para deploy
- 🧪 Dados de teste
- ⚡ Performance otimizada

---

## 📝 Licença

Este projeto está disponível para uso livre e pessoal.

---

## 🎯 Próximos Passos

1. ✅ Abra [QUICK_START.md](./QUICK_START.md)
2. ✅ Execute `bd/INSTALAR.bat`
3. ✅ Configure o banco de dados
4. ✅ Inicie frontend e backend
5. ✅ Customize conforme necessário

---

<div align="center">

### 🚀 Pronto para começar?

**[→ Abra QUICK_START.md ←](./QUICK_START.md)**

---

*Desenvolvido com ❤️ para sua aplicação de login futurista*

**v1.0.0** | Abril 2026 | [Documentação Completa](./INDEX.md)

</div>
