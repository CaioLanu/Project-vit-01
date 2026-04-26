# 📊 Banco de Dados - Login Futurista

## Estrutura do Banco de Dados

### Database: `login_db`

```sql
CREATE DATABASE login_db;
```

## Tabela: `users`

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);
```

### Colunas

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | INT | ID único (chave primária) |
| `name` | VARCHAR(100) | Nome completo do usuário |
| `email` | VARCHAR(120) | Email único |
| `password_hash` | VARCHAR(255) | Senha hashida com bcrypt |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Última atualização |

## 🔑 Índices

- `PRIMARY KEY` em `id` para acesso rápido
- `UNIQUE` em `email` para evitar duplicatas
- `INDEX` em `email` para buscas rápidas

## 📝 Dados de Teste

```sql
-- Admin
INSERT INTO users (name, email, password_hash) VALUES 
('Admin User', 'admin@example.com', '$2a$10$nOUIs5kJ7naTuTFkWK1Be.DlH.Xxu7OWvxJ7lLUg3XUVUd6F8RFDe');

-- Demo
INSERT INTO users (name, email, password_hash) VALUES 
('Demo User', 'demo@example.com', '$2a$10$Y9lfsSAlqaXZHeBI3zK4/OPST9/PgBkqq8Ey4F2A2Z9Y8X5K2c7Ge');
```

**Senhas originais:**
- admin: `admin123`
- demo: `demo123`

## 🔍 Queries Úteis

### Listar todos os usuários
```sql
SELECT id, name, email, created_at FROM users;
```

### Buscar usuário por email
```sql
SELECT * FROM users WHERE email = 'admin@example.com';
```

### Contar usuários
```sql
SELECT COUNT(*) as total FROM users;
```

### Deletar usuário (cuidado!)
```sql
DELETE FROM users WHERE id = 1;
```

### Atualizar usuário
```sql
UPDATE users SET name = 'Novo Nome' WHERE id = 1;
```

---

## 🛠️ Como Usar com DBeaver

### 1️⃣ Criar Conexão

1. Abra **DBeaver**
2. Clique em **Database** → **New Database Connection**
3. Selecione **MySQL** e clique **Next**
4. Preencha:
   - **Server Host:** localhost
   - **Port:** 3306
   - **Database:** login_db
   - **Username:** root
   - **Password:** (sua senha, se houver)
5. Clique **Test Connection** para verificar
6. Clique **Finish**

### 2️⃣ Importar Script SQL

1. Na conexão criada, clique direito
2. Selecione **SQL Editor** → **New SQL Query**
3. Copie todo o conteúdo de `bd/setup.sql`
4. Cole na janela SQL
5. Clique **Execute** (ou Ctrl+Enter)

### 3️⃣ Ver Dados

1. Expanda a conexão MySQL
2. Clique em **Databases** → **login_db**
3. Clique em **Tables** → **users**
4. Clique em **Data** para ver os registros

### 4️⃣ Executar Queries

1. Clique direito na tabela **users**
2. Selecione **Generate SQL** para ver exemplos
3. Ou crie um novo SQL Query e execute manualmente

### 5️⃣ Editar Dados (GUI)

1. Clique duplo na tabela **users**
2. Aparecerá uma grid com os dados
3. Você pode editar diretamente na tabela
4. Clique **Save** (ou Ctrl+S)

---

## 🔐 Segurança

### Hashing de Senhas

Todas as senhas são hashidas com **bcrypt** cost factor 10:

```javascript
// Como é feito no backend
const hashedPassword = await bcrypt.hash(password, 10);
```

### NUNCA faça isso:
```sql
-- ❌ ERRADO - Nunca armazene senhas em texto plano!
INSERT INTO users (name, email, password_hash) VALUES 
('User', 'user@example.com', 'minhasenha123');
```

---

## 📈 Performance

- Índices em `id` e `email` para buscas rápidas
- Coluna `email` é UNIQUE para evitar duplicatas
- Timestamps automáticos para auditoria

---

## 🔄 Backup e Restore

### Fazer Backup
```bash
mysqldump -u root -p login_db > backup.sql
```

### Restaurar do Backup
```bash
mysql -u root -p login_db < backup.sql
```

---

## 🚀 Próximos Passos

- [ ] Adicionar coluna `is_active` para desativar usuários
- [ ] Adicionar coluna `role` para controle de acesso
- [ ] Adicionar tabela de `sessions`
- [ ] Implementar soft delete com `deleted_at`
- [ ] Usar migrations (Flyway, Liquibase)
