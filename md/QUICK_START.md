# 🚀 QUICK START - Login Futurista

## ⚡ Iniciar em 3 Minutos

### 1️⃣ Instalar Dependências
```bash
# Windows
cd bd && npm install && cd .. && npm install

# Ou execute
bd/INSTALAR.bat
```

### 2️⃣ Configurar Banco de Dados
```bash
# Abra DBeaver e execute bd/setup.sql
# Ou no CMD:
mysql -u root -p < bd/setup.sql
```

### 3️⃣ Iniciar Tudo

**Terminal 1 - Backend:**
```bash
cd bd
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 4️⃣ Acessar
```
http://localhost:5173
```

---

## 🔑 Credenciais de Teste

```
Email: admin@example.com
Senha: admin123
```

---

## 📁 Arquivos Principais

| Arquivo | Descrição |
|---------|-----------|
| `src/components/Login.tsx` | Componente de login |
| `src/styles/Login.css` | Estilos futuristas |
| `bd/server.js` | Backend Node.js |
| `bd/setup.sql` | Script do banco de dados |

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | Guia completo de configuração |
| [DBEAVER_GUIDE.md](./DBEAVER_GUIDE.md) | Como usar DBeaver |
| [DATABASE_GUIDE.md](./DATABASE_GUIDE.md) | Estrutura do banco de dados |
| [API_EXAMPLES.md](./API_EXAMPLES.md) | Exemplos de requisições |

---

## ⚙️ Verificar se Tudo Está Funcionando

1. **Backend rodando?**
   ```
   Veja a mensagem: "Servidor rodando em http://localhost:5000"
   ```

2. **Frontend rodando?**
   ```
   Veja a mensagem: "Local: http://localhost:5173"
   ```

3. **Banco de dados criado?**
   ```
   Abra DBeaver e procure por "login_db"
   ```

4. **Login funcionando?**
   ```
   Insira: admin@example.com / admin123
   Clique em "Entrar"
   ```

---

## 🆘 Problemas Comuns

### ❌ "Erro de conexão com o servidor"
- Verifique se o backend está rodando em `http://localhost:5000`
- Rode: `cd bd && npm run dev`

### ❌ "Banco de dados não encontrado"
- Execute `bd/setup.sql` no DBeaver ou MySQL CLI
- Comando: `mysql -u root -p < bd/setup.sql`

### ❌ "Erro: ECONNREFUSED"
- MySQL não está rodando
- Inicie MySQL e tente novamente

---

## 🎨 O Que Você Tem

✅ Tela de login futurista com animações  
✅ Tela de registro de usuários  
✅ Backend em Node.js com Express  
✅ Banco de dados MySQL  
✅ Autenticação com JWT  
✅ Design responsivo  
✅ Documentação completa  

---

## 🎯 Próximas Etapas

1. Customizar cores e design conforme desejar
2. Adicionar mais campos ao registro
3. Implementar "Esqueceu Senha"
4. Criar dashboard protegido
5. Deploy em produção

---

## 💡 Dicas

- Use o script `INSTALAR.bat` para instalar tudo rapidinho
- Abra DBeaver para gerenciar o banco de dados visualmente
- Consulte `API_EXAMPLES.md` para exemplos de requisições
- Leia `DBEAVER_GUIDE.md` para aprender DBeaver

---

**Tudo pronto? Comece agora! 🚀**
