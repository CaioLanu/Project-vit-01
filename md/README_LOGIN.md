# 🎨 Login Futurista - Aplicação de Autenticação

Uma aplicação web moderna com interface futurista para autenticação de usuários integrada com banco de dados MySQL.

## 🚀 Quick Start

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd bd
npm install
npm run dev
```

### Banco de Dados
```bash
# Execute o script SQL em bd/setup.sql
mysql -u root -p < bd/setup.sql
```

**Ou abra `bd/setup.sql` no DBeaver e execute.**

## 📖 Documentação Completa

Veja [SETUP_GUIDE.md](./SETUP_GUIDE.md) para instruções detalhadas.

## 🎯 Features

- ✨ Interface futurista com animações suaves
- 🔐 Autenticação segura com JWT
- 🗄️ Banco de dados MySQL
- 📱 Responsivo
- 🎨 Design moderno com gradientes e blur effects
- 🚀 TypeScript + React + Vite

## 📦 Estrutura

```
├── src/
│   ├── components/    # Componentes React
│   ├── services/      # Serviços de API
│   ├── styles/        # Estilos CSS
│   └── types/         # Tipos TypeScript
├── bd/                # Backend Node.js
│   ├── server.js      # Servidor Express
│   ├── setup.sql      # Script do banco
│   └── .env           # Configurações
```

## 🔑 Credenciais de Teste

- **Email:** admin@example.com
- **Senha:** admin123

## 🛠️ Tecnologias

- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js, Express, MySQL
- **Auth:** JWT, bcrypt
- **UI:** CSS3, Animações

## 📞 Suporte

Para dúvidas ou problemas, consulte o guia de troubleshooting em SETUP_GUIDE.md
