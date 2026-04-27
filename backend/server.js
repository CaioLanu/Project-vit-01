import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do Pool MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'localhost',
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'login_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'Servidor funcionando' });
});

// Rota de Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios',
      });
    }

    const connection = await pool.getConnection();

    // Buscar usuário
    const [rows] = await connection.execute(
      'SELECT id, name, email, password_hash FROM users WHERE email = ?',
      [email]
    );

    connection.release();

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos',
      });
    }

    const user = rows[0];

    // Validar senha
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos',
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'seu-segredo-super-secreto',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

// Rota de Registro - Cria solicitação pendente
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, unit_id } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email e senha são obrigatórios',
      });
    }

    if (!unit_id) {
      return res.status(400).json({
        success: false,
        message: 'Selecione uma unidade',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Senha deve ter no mínimo 6 caracteres',
      });
    }

    const connection = await pool.getConnection();

    // Verificar se email já existe em users ou pending_registrations
    const [existingUser] = await connection.execute(
      'SELECT id FROM users WHERE email = ? UNION SELECT id FROM pending_registrations WHERE email = ?',
      [email, email]
    );

    if (existingUser.length > 0) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado',
      });
    }

    // Verificar se unidade existe
    const [unitRows] = await connection.execute(
      'SELECT id FROM units WHERE id = ?',
      [unit_id]
    );

    if (unitRows.length === 0) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Unidade inválida',
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserir registro pendente de aprovação
    await connection.execute(
      'INSERT INTO pending_registrations (name, email, password_hash, unit_id, status) VALUES (?, ?, ?, ?, "pending")',
      [name, email, hashedPassword, unit_id]
    );

    connection.release();

    res.status(201).json({
      success: true,
      message: 'Solicitação de cadastro enviada! Aguarde a aprovação do administrador da unidade.',
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

// Middleware de autenticação
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token não fornecido',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu-segredo-super-secreto');
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT u.id, u.email, u.unit_id, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
      [decoded.id]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    req.user = {
      id: rows[0].id,
      email: rows[0].email,
      role: rows[0].role_name,
      unit_id: rows[0].unit_id,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
  }
};

// Rota protegida de exemplo
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      `SELECT u.id, u.name, u.email, u.unit_id, un.name as unit_name, r.name as role
       FROM users u
       LEFT JOIN units un ON u.unit_id = un.id
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [req.user.id]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    res.json({
      success: true,
      user: rows[0],
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

// Rota de logout
app.post('/api/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout realizado com sucesso',
  });
});

// ===== NOVAS ROTAS PARA SISTEMA DE QUENTINHAS =====

// Middleware para verificar roles
const checkRole = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
        [req.user.id]
      );
      connection.release();

      if (rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Usuário não encontrado',
        });
      }

      const userRole = rows[0].role_name;
      if (!requiredRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado - permissões insuficientes',
        });
      }

      req.user.role = userRole;
      next();
    } catch (error) {
      console.error('Erro ao verificar role:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  };
};

// ===== EMPRESAS =====

// Listar empresas (Admin/Master)
app.get('/api/companies', authMiddleware, checkRole(['admin', 'master']), async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM companies ORDER BY name');
    connection.release();

    res.json({
      success: true,
      companies: rows,
    });
  } catch (error) {
    console.error('Erro ao listar empresas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

// Criar empresa (Admin/Master)
app.post('/api/companies', authMiddleware, checkRole(['admin', 'master']), async (req, res) => {
  try {
    const { name, cnpj, address, phone, email } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Nome da empresa é obrigatório',
      });
    }

    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO companies (name, cnpj, address, phone, email) VALUES (?, ?, ?, ?, ?)',
      [name, cnpj, address, phone, email]
    );
    connection.release();

    res.status(201).json({
      success: true,
      message: 'Empresa criada com sucesso',
    });
  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

// ===== UNIDADES =====

// Listar unidades (todos os usuários logados)
app.get('/api/units', authMiddleware, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    let query = 'SELECT u.*, c.name as company_name FROM units u JOIN companies c ON u.company_id = c.id';
    let params = [];

    // Se for usuário comum, mostrar apenas sua unidade
    if (req.user.role === 'user') {
      query += ' WHERE u.id = (SELECT unit_id FROM users WHERE id = ?)';
      params = [req.user.id];
    }

    query += ' ORDER BY u.name';

    const [rows] = await connection.execute(query, params);
    connection.release();

    res.json({
      success: true,
      units: rows,
    });
  } catch (error) {
    console.error('Erro ao listar unidades:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

// Criar unidade (Admin/Master)
app.post('/api/units', authMiddleware, checkRole(['admin', 'master']), async (req, res) => {
  try {
    const { name, company_id, address, phone, capacity } = req.body;

    if (!name || !company_id) {
      return res.status(400).json({
        success: false,
        message: 'Nome da unidade e empresa são obrigatórios',
      });
    }

    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO units (name, company_id, address, phone, capacity) VALUES (?, ?, ?, ?, ?)',
      [name, company_id, address, phone, capacity]
    );
    connection.release();

    res.status(201).json({
      success: true,
      message: 'Unidade criada com sucesso',
    });
  } catch (error) {
    console.error('Erro ao criar unidade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

// ===== USUÁRIOS =====

// Listar usuários (Master pode ver todos, Admin vê usuários de suas unidades)
app.get('/api/users', authMiddleware, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    let query = `
      SELECT u.id, u.name, u.email, u.is_active, u.created_at,
             r.name as role_name, un.name as unit_name, un.id as unit_id, c.name as company_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN units un ON u.unit_id = un.id
      LEFT JOIN companies c ON un.company_id = c.id
    `;
    let params = [];

    if (req.user.role === 'admin') {
      // Admin vê apenas usuários de suas unidades
      query += ' WHERE u.role_id = 1 AND un.id IN (SELECT unit_id FROM users WHERE id = ? AND role_id = 2)';
      params = [req.user.id];
    } else if (req.user.role === 'user') {
      // Usuários normais só veem si mesmos
      query += ' WHERE u.id = ?';
      params = [req.user.id];
    } else {
      // Master vê todos os usuários normais
      query += ' WHERE u.role_id = 1';
    }

    query += ' ORDER BY u.name';

    const [rows] = await connection.execute(query, params);
    connection.release();

    res.json({
      success: true,
      users: rows,
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

// Bloquear/desbloquear usuário (Admin/Master)
app.put('/api/users/:id/status', authMiddleware, checkRole(['admin', 'master']), async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'is_active deve ser um booleano (true/false)',
      });
    }

    const connection = await pool.getConnection();

    // Buscar usuário
    const [users] = await connection.execute(
      'SELECT u.*, un.id as unit_id FROM users u LEFT JOIN units un ON u.unit_id = un.id WHERE u.id = ?',
      [id]
    );

    if (users.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    const user = users[0];

    // Verificar permissões do admin
    if (req.user.role === 'admin') {
      // Admin só pode gerenciar usuários de sua unidade
      const [adminUnits] = await connection.execute(
        'SELECT unit_id FROM users WHERE id = ? AND role_id = 2',
        [req.user.id]
      );
      
      if (adminUnits.length === 0 || adminUnits[0].unit_id !== user.unit_id) {
        connection.release();
        return res.status(403).json({
          success: false,
          message: 'Você não tem permissão para gerenciar usuários desta unidade',
        });
      }
    }

    // Não permitir desativar a si mesmo
    if (id == req.user.id && !is_active) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Você não pode bloquear sua própria conta',
      });
    }

    // Atualizar status
    await connection.execute(
      'UPDATE users SET is_active = ? WHERE id = ?',
      [is_active, id]
    );

    connection.release();

    res.json({
      success: true,
      message: `Usuário ${is_active ? 'desbloqueado' : 'bloqueado'} com sucesso`,
    });
  } catch (error) {
    console.error('Erro ao atualizar status do usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

// Criar usuário (Master/Admin)
app.post('/api/users', authMiddleware, checkRole(['admin', 'master']), async (req, res) => {
  try {
    const { name, email, password, role_id, unit_id } = req.body;

    if (!name || !email || !password || !role_id) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email, senha e role são obrigatórios',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Senha deve ter no mínimo 6 caracteres',
      });
    }

    const connection = await pool.getConnection();

    // Verificar se email já existe
    const [existingUser] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado',
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserir novo usuário
    await connection.execute(
      'INSERT INTO users (name, email, password_hash, role_id, unit_id) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role_id, unit_id]
    );

    connection.release();

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

// ===== REGISTROS PENDENTES DE APROVAÇÃO =====

// Listar registros pendentes (Admin/Master)
app.get('/api/pending-registrations', authMiddleware, checkRole(['admin', 'master']), async (req, res) => {
  try {
    const connection = await pool.getConnection();
    let query = `
      SELECT pr.id, pr.name, pr.email, pr.unit_id, un.name as unit_name,
             pr.status, pr.requested_at, pr.reviewed_at, rev.name as reviewed_by_name,
             pr.rejection_reason
      FROM pending_registrations pr
      JOIN units un ON pr.unit_id = un.id
      LEFT JOIN users rev ON pr.reviewed_by = rev.id
    `;
    let params = [];

    // Se for admin, mostrar apenas registros de sua unidade
    if (req.user.role === 'admin') {
      query += ' WHERE un.id IN (SELECT unit_id FROM users WHERE id = ? AND role_id = 2)';
      params = [req.user.id];
    }

    query += ' ORDER BY pr.status DESC, pr.requested_at DESC';

    const [rows] = await connection.execute(query, params);
    connection.release();

    res.json({
      success: true,
      pending_registrations: rows,
    });
  } catch (error) {
    console.error('Erro ao listar registros pendentes:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

// Aprovar ou rejeitar registro pendente (Admin/Master)
app.put('/api/pending-registrations/:id/status', authMiddleware, checkRole(['admin', 'master']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejection_reason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status deve ser "approved" ou "rejected"',
      });
    }

    const connection = await pool.getConnection();

    // Buscar registro pendente
    const [registrations] = await connection.execute(
      'SELECT * FROM pending_registrations WHERE id = ?',
      [id]
    );

    if (registrations.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'Registro não encontrado',
      });
    }

    const registration = registrations[0];

    // Verificar permissões do admin
    if (req.user.role === 'admin') {
      const [adminUnits] = await connection.execute(
        'SELECT unit_id FROM users WHERE id = ? AND role_id = 2',
        [req.user.id]
      );
      if (adminUnits.length === 0 || adminUnits[0].unit_id !== registration.unit_id) {
        connection.release();
        return res.status(403).json({
          success: false,
          message: 'Você não tem permissão para revisar registros desta unidade',
        });
      }
    }

    if (status === 'approved') {
      // Hash da senha já existe no registro, então podemos usar diretamente
      await connection.execute(
        'INSERT INTO users (name, email, password_hash, role_id, unit_id) VALUES (?, ?, ?, 1, ?)',
        [registration.name, registration.email, registration.password_hash, registration.unit_id]
      );
    }

    // Atualizar status do registro pendente
    await connection.execute(
      'UPDATE pending_registrations SET status = ?, reviewed_by = ?, reviewed_at = NOW(), rejection_reason = ? WHERE id = ?',
      [status, req.user.id, rejection_reason || null, id]
    );

    connection.release();

    res.json({
      success: true,
      message: `Registro ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso`,
    });
  } catch (error) {
    console.error('Erro ao atualizar registro pendente:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

// ===== SOLICITAÇÕES DE QUENTINHAS =====

// Listar solicitações (usuários veem suas próprias, admin/master veem todas)
app.get('/api/lunch-requests', authMiddleware, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    let query = `
      SELECT lr.*, u.name as user_name, un.name as unit_name,
             au.name as approved_by_name
      FROM lunch_requests lr
      JOIN users u ON lr.user_id = u.id
      JOIN units un ON lr.unit_id = un.id
      LEFT JOIN users au ON lr.approved_by = au.id
    `;
    let params = [];

    if (req.user.role === 'user') {
      query += ' WHERE lr.user_id = ?';
      params = [req.user.id];
    }

    query += ' ORDER BY lr.created_at DESC';

    const [rows] = await connection.execute(query, params);
    connection.release();

    res.json({
      success: true,
      requests: rows,
    });
  } catch (error) {
    console.error('Erro ao listar solicitações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

// Criar solicitação (apenas usuários)
app.post('/api/lunch-requests', authMiddleware, checkRole(['user']), async (req, res) => {
  try {
    const { quantity, request_date, notes } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantidade deve ser maior que zero',
      });
    }

    const connection = await pool.getConnection();

    // Buscar unidade do usuário
    const [userRows] = await connection.execute(
      'SELECT unit_id FROM users WHERE id = ?',
      [req.user.id]
    );

    if (userRows.length === 0 || !userRows[0].unit_id) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Usuário não está associado a uma unidade',
      });
    }

    const unit_id = userRows[0].unit_id;

    // Inserir solicitação
    await connection.execute(
      'INSERT INTO lunch_requests (user_id, unit_id, quantity, request_date, notes) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, unit_id, quantity, request_date || new Date().toISOString().split('T')[0], notes]
    );

    connection.release();

    res.status(201).json({
      success: true,
      message: 'Solicitação criada com sucesso',
    });
  } catch (error) {
    console.error('Erro ao criar solicitação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

// Aprovar/rejeitar solicitação (Admin/Master)
app.put('/api/lunch-requests/:id/status', authMiddleware, checkRole(['admin', 'master']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status deve ser "approved" ou "rejected"',
      });
    }

    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE lunch_requests SET status = ?, approved_by = ?, approved_at = NOW(), notes = CONCAT(IFNULL(notes, ""), " | ", ?) WHERE id = ?',
      [status, req.user.id, notes || `Aprovado por ${req.user.email}`, id]
    );
    connection.release();

    res.json({
      success: true,
      message: `Solicitação ${status === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso`,
    });
  } catch (error) {
    console.error('Erro ao atualizar solicitação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

// ===== RELATÓRIOS =====

// Relatório de solicitações (todos os usuários)
app.get('/api/reports/requests', authMiddleware, async (req, res) => {
  try {
    const { start_date, end_date, unit_id, status } = req.query;
    const connection = await pool.getConnection();

    let query = `
      SELECT
        DATE(lr.request_date) as date,
        un.name as unit_name,
        u.name as user_name,
        lr.quantity,
        lr.status,
        lr.created_at
      FROM lunch_requests lr
      JOIN users u ON lr.user_id = u.id
      JOIN units un ON lr.unit_id = un.id
      WHERE 1=1
    `;
    let params = [];

    if (start_date) {
      query += ' AND lr.request_date >= ?';
      params.push(start_date);
    }

    if (end_date) {
      query += ' AND lr.request_date <= ?';
      params.push(end_date);
    }

    if (unit_id) {
      query += ' AND lr.unit_id = ?';
      params.push(unit_id);
    }

    if (status) {
      query += ' AND lr.status = ?';
      params.push(status);
    }

    // Filtros por permissão
    if (req.user.role === 'user') {
      query += ' AND lr.user_id = ?';
      params.push(req.user.id);
    } else if (req.user.role === 'admin') {
      query += ' AND un.id IN (SELECT unit_id FROM users WHERE id = ? AND role_id = 2)';
      params.push(req.user.id);
    }

    query += ' ORDER BY lr.request_date DESC, lr.created_at DESC';

    const [rows] = await connection.execute(query, params);
    connection.release();

    res.json({
      success: true,
      report: rows,
    });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

// Relatório de pedidos diários
app.get('/api/reports/daily-orders', authMiddleware, async (req, res) => {
  try {
    const { start_date, end_date, unit_id } = req.query;
    const connection = await pool.getConnection();
    let query = `
      SELECT do.order_date, do.total_requests, do.total_quantity,
             u.name as unit_name, c.name as company_name
      FROM daily_orders do
      JOIN units u ON do.unit_id = u.id
      JOIN companies c ON u.company_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (start_date) {
      query += ' AND do.order_date >= ?';
      params.push(start_date);
    }

    if (end_date) {
      query += ' AND do.order_date <= ?';
      params.push(end_date);
    }

    if (unit_id) {
      query += ' AND do.unit_id = ?';
      params.push(unit_id);
    }

    if (req.user.role === 'user') {
      query += ' AND do.unit_id = ?';
      params.push(req.user.unit_id);
    } else if (req.user.role === 'admin') {
      query += ' AND do.unit_id = ?';
      params.push(req.user.unit_id);
    }

    query += ' ORDER BY do.order_date ASC';

    const [rows] = await connection.execute(query, params);
    connection.release();

    res.json({
      success: true,
      daily_orders: rows,
    });
  } catch (error) {
    console.error('Erro ao gerar relatório diário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

// Relatório de usuários por unidade
app.get('/api/reports/users-by-unit', authMiddleware, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    let query = `
      SELECT u.id, u.name, u.email, u.is_active, u.created_at,
             un.id as unit_id, un.name as unit_name,
             c.id as company_id, c.name as company_name,
             r.name as role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN units un ON u.unit_id = un.id
      LEFT JOIN companies c ON un.company_id = c.id
      WHERE u.role_id = 1
    `;
    let params = [];

    // Se for admin, mostrar apenas usuários de suas unidades
    if (req.user.role === 'admin') {
      query += ' AND un.id IN (SELECT unit_id FROM users WHERE id = ? AND role_id = 2)';
      params = [req.user.id];
    } else if (req.user.role === 'user') {
      // Usuário comum só vê usuários de sua unidade
      query += ' AND un.id = (SELECT unit_id FROM users WHERE id = ?)';
      params = [req.user.id];
    }

    query += ' ORDER BY un.name, u.name';

    const [rows] = await connection.execute(query, params);
    connection.release();

    // Agrupar por unidade para melhor visualização
    const reportByUnit = {};
    rows.forEach(user => {
      if (!reportByUnit[user.unit_id]) {
        reportByUnit[user.unit_id] = {
          unit_id: user.unit_id,
          unit_name: user.unit_name,
          company_id: user.company_id,
          company_name: user.company_name,
          users: []
        };
      }
      reportByUnit[user.unit_id].users.push({
        id: user.id,
        name: user.name,
        email: user.email,
        is_active: user.is_active,
        created_at: user.created_at
      });
    });

    res.json({
      success: true,
      report_by_unit: Object.values(reportByUnit),
      total_units: Object.keys(reportByUnit).length,
      total_users: rows.length
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log('Endpoints disponíveis:');
  console.log('  POST /api/login - Fazer login');
  console.log('  POST /api/register - Criar solicitação de cadastro (requer unit_id)');
  console.log('  GET /api/profile - Obter perfil (requer autenticação)');
  console.log('  POST /api/logout - Logout');
  console.log('  GET /api/health - Verificar saúde do servidor');
  console.log('  GET /api/companies - Listar empresas (admin/master)');
  console.log('  POST /api/companies - Criar empresa (admin/master)');
  console.log('  GET /api/units - Listar unidades');
  console.log('  POST /api/units - Criar unidade (admin/master)');
  console.log('  GET /api/users - Listar usuários');
  console.log('  PUT /api/users/:id/status - Bloquear/desbloquear usuário (admin/master)');
  console.log('  POST /api/users - Criar usuário (admin/master)');
  console.log('  GET /api/pending-registrations - Listar registros pendentes (admin/master)');
  console.log('  PUT /api/pending-registrations/:id/status - Aprovar/rejeitar registro (admin/master)');
  console.log('  GET /api/lunch-requests - Listar solicitações');
  console.log('  POST /api/lunch-requests - Criar solicitação (user)');
  console.log('  PUT /api/lunch-requests/:id/status - Aprovar/rejeitar (admin/master)');
  console.log('  GET /api/reports/requests - Relatório de solicitações');
  console.log('  GET /api/reports/daily-orders - Relatório de pedidos diários');
  console.log('  GET /api/reports/users-by-unit - Relatório de usuários por unidade');
});
