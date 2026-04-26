# 📚 Exemplos de Integração com a API

Este arquivo mostra exemplos práticos de como usar a API de autenticação.

## 1️⃣ Login

### Request
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### Response (Success)
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com"
  }
}
```

### Response (Error)
```json
{
  "success": false,
  "message": "Email ou senha incorretos"
}
```

## 2️⃣ Registro

### Request
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Novo Usuário",
    "email": "novo@example.com",
    "password": "senha123"
  }'
```

### Response (Success)
```json
{
  "success": true,
  "message": "Usuário criado com sucesso"
}
```

### Response (Error - Email já existe)
```json
{
  "success": false,
  "message": "Email já cadastrado"
}
```

## 3️⃣ Buscar Perfil (Com Autenticação)

### Request
```bash
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer seu_token_jwt"
```

### Response
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com"
  }
}
```

## 4️⃣ Logout

### Request
```bash
curl -X POST http://localhost:5000/api/logout
```

### Response
```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

## 5️⃣ Health Check

### Request
```bash
curl http://localhost:5000/api/health
```

### Response
```json
{
  "status": "Servidor funcionando"
}
```

---

## 💻 Exemplos em JavaScript/React

### Login com Fetch
```typescript
async function login(email: string, password: string) {
  const response = await fetch('http://localhost:5000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (data.success) {
    localStorage.setItem('token', data.token);
    return data.user;
  } else {
    throw new Error(data.message);
  }
}
```

### Chamar API Protegida
```typescript
async function getProfile(token: string) {
  const response = await fetch('http://localhost:5000/api/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
}
```

### Usando Axios
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
const loginResponse = await api.post('/login', {
  email: 'admin@example.com',
  password: 'admin123',
});

// Perfil
const profileResponse = await api.get('/profile');
```

---

## 🔒 Status Codes

| Status | Significado |
|--------|-------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Autenticação necessária/falhou |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

---

## 🔑 Como Usar o Token

1. Após fazer login, você receberá um `token` JWT
2. Armazene em `localStorage`: `localStorage.setItem('token', data.token)`
3. Em todas as requisições protegidas, adicione o header:
   ```
   Authorization: Bearer seu_token_aqui
   ```

---

## ⏰ Expiração de Token

- Os tokens JWT são válidos por **24 horas**
- Após expiração, o usuário precisa fazer login novamente
- Você pode implementar refresh tokens para melhor UX

---

## 🧪 Testar com Postman

1. Abra o Postman
2. Crie uma nova requisição POST para: `http://localhost:5000/api/login`
3. Na aba "Body", selecione "raw" e "JSON"
4. Coloque:
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```
5. Clique em "Send"
6. Copie o token da resposta
7. Para requisições protegidas, vá para "Headers" e adicione:
   - Key: `Authorization`
   - Value: `Bearer seu_token_aqui`
