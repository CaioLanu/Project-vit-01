# 🛠️ Guia de Configuração - DBeaver

## O que é DBeaver?

DBeaver é uma ferramenta de gerenciamento de banco de dados grátis e open-source. Ela permite gerenciar facilmente seus bancos de dados MySQL, PostgreSQL, e muitos outros.

**Download:** https://dbeaver.io/download/

---

## 📋 Passo a Passo - Primeira Conexão

### 1️⃣ Abrir DBeaver

Após instalar e abrir o DBeaver, você verá a tela inicial.

### 2️⃣ Criar Conexão ao MySQL

1. Vá ao menu: **Database** → **New Database Connection**
   
   ![Passo 1](./docs/dbeaver-step-1.png)

2. Selecione **MySQL** na lista
   
   ![Passo 2](./docs/dbeaver-step-2.png)

3. Clique **Next** para continuar

### 3️⃣ Configurar Conexão

Preencha os dados:

```
Server Host: localhost
Port: 3306
Database: (deixe em branco por enquanto)
Username: root
Password: (deixe em branco se não tiver, ou insira a senha)
```

Clique em **Test Connection** para verificar se está tudo correto.

Se aparecer uma mensagem de sucesso, continue.

### 4️⃣ Concluir

Clique **Finish** e sua conexão estará criada.

---

## 📂 Estrutura no DBeaver

```
Connections
└── MySQL
    └── localhost (ou seu servidor)
        ├── Databases
        │   ├── information_schema
        │   ├── mysql
        │   ├── performance_schema
        │   └── login_db ← Seu banco
        │       ├── Tables
        │       │   └── users ← Sua tabela
        │       ├── Views
        │       ├── Stored Procedures
        │       └── Functions
```

---

## 🗄️ Criar Banco de Dados e Tabela

### Opção 1: Importar Script SQL (Recomendado)

1. Clique direito na conexão MySQL
2. Selecione **SQL Editor** → **New SQL Query**
3. Copie todo o conteúdo do arquivo `bd/setup.sql`
4. Cole na janela de query
5. Clique em **Execute All** (ou Ctrl+Shift+E)

Pronto! Seu banco de dados e tabela estarão criados.

### Opção 2: Criar Manualmente

1. Clique direito em **Databases**
2. Selecione **Create New Database**
3. Nome: `login_db`
4. Clique **OK**

---

## 📊 Ver Dados da Tabela

1. Expanda: **Databases** → **login_db** → **Tables**
2. Clique duplo em **users**
3. Você verá uma grid com todos os usuários

---

## ✏️ Editar Dados

### Adicionar Novo Usuário (GUI)

1. Na grid de dados, clique no botão **+** (adicionar linha)
2. Preencha os campos:
   - **name:** Seu nome
   - **email:** seu@email.com
   - **password_hash:** Deixe vazio por enquanto
3. Clique **Save**

⚠️ **Nota:** Senhas devem ser hashidas com bcrypt. Use o backend para registrar novos usuários!

### Editar Usuário

1. Clique duplo no campo que quer editar
2. Modifique o valor
3. Pressione **Enter** ou clique em **Save**

### Deletar Usuário

1. Clique direito na linha
2. Selecione **Delete Row**
3. Clique **Confirm**

---

## 🔍 Executar Queries Customizadas

### Buscar Usuário por Email

1. Clique direito na conexão
2. **SQL Editor** → **New SQL Query**
3. Digite:
   ```sql
   SELECT * FROM login_db.users WHERE email = 'admin@example.com';
   ```
4. Clique **Execute**

### Listar Todos os Usuários

```sql
SELECT id, name, email, created_at FROM login_db.users;
```

### Contar Usuários

```sql
SELECT COUNT(*) as total_users FROM login_db.users;
```

---

## 💾 Backup e Restore

### Fazer Backup

1. Clique direito no banco **login_db**
2. Selecione **Tools** → **Backup**
3. Escolha local para salvar
4. Clique **OK**

### Restaurar do Backup

1. Clique direito em **Databases**
2. Selecione **Restore from Backup**
3. Selecione o arquivo de backup
4. Clique **OK**

---

## 🔐 Ver Detalhes da Tabela

1. Clique direito na tabela **users**
2. Selecione **View Table Definition** ou **Properties**
3. Você verá:
   - Estrutura das colunas
   - Tipos de dados
   - Índices
   - Chaves primárias

---

## 🎨 Dicas e Truques

### Sintaxe Colorida

DBeaver colore automaticamente as keywords SQL:
- `SELECT`, `WHERE`, `INSERT` em azul
- Strings em vermelho
- Números em verde

### Autocomplete

Digite `SELECT * FROM` e o DBeaver sugerirá as tabelas disponíveis.

### Ver Estrutura das Tabelas

Clique em **Columns** para ver todas as colunas e seus tipos.

### Export de Dados

1. Clique direito na tabela
2. **Export Table Data**
3. Escolha formato (CSV, JSON, Excel, etc.)

---

## ⚙️ Configurações Úteis

### Autocommit

Por padrão, mudanças são automaticamente salvas (autocommit ON).

Se quiser desativar:
1. **File** → **Preferences**
2. **Database** → **SQL Editor** → **SQL Scripts**
3. Desmarque **Auto-commit by default**

### Tema

1. **File** → **Preferences**
2. **User Interface** → **Appearance**
3. Escolha Light, Dark ou System

---

## 🆘 Troubleshooting

### Erro: "Connection refused"
- Verifique se MySQL está rodando
- Verifique se host/port estão corretos
- Verifique credenciais de acesso

### Erro: "Unknown database"
- Certifique-se que você executou `setup.sql`
- Ou crie manualmente o banco `login_db`

### Banco aparece vazio
- Clique em **Refresh** (F5)
- Ou clique direito e **Refresh**

---

## 📚 Recursos Adicionais

- **Site DBeaver:** https://dbeaver.io
- **Documentação:** https://dbeaver.com/docs
- **Tutorial YouTube:** Procure por "DBeaver MySQL tutorial"

---

**Dúvidas? Verifique SETUP_GUIDE.md para mais informações!**
