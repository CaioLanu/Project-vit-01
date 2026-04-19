-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS login_db
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE login_db;

-- Criar tabela de roles
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_role_name (name)
);

-- Criar tabela de empresas
CREATE TABLE IF NOT EXISTS companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  cnpj VARCHAR(18) UNIQUE,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(120),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_company_name (name),
  INDEX idx_company_cnpj (cnpj)
);

-- Criar tabela de unidades
CREATE TABLE IF NOT EXISTS units (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  company_id INT NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  capacity INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  INDEX idx_unit_company (company_id),
  INDEX idx_unit_name (name)
);

-- Criar tabela de usuários (atualizada)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id INT NOT NULL DEFAULT 1,
  unit_id INT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL,
  INDEX idx_email (email),
  INDEX idx_user_role (role_id),
  INDEX idx_user_unit (unit_id)
);

-- Criar tabela de solicitações de quentinhas
CREATE TABLE IF NOT EXISTS lunch_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  unit_id INT NOT NULL,
  quantity INT NOT NULL,
  request_date DATE NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'delivered') DEFAULT 'pending',
  notes TEXT,
  approved_by INT NULL,
  approved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_request_user (user_id),
  INDEX idx_request_unit (unit_id),
  INDEX idx_request_date (request_date),
  INDEX idx_request_status (status)
);

-- Inserir roles padrão
INSERT INTO roles (name, description) VALUES
('user', 'Usuário solicitante - pode solicitar quentinhas e ver relatórios'),
('admin', 'Administrador - pode criar unidades e cadastrar empresas'),
('master', 'Master - pode gerenciar todos os usuários e unidades')
ON DUPLICATE KEY UPDATE name = name;

-- Inserir empresas de exemplo
INSERT INTO companies (name, cnpj, address, phone, email) VALUES
('Empresa Exemplo LTDA', '12.345.678/0001-90', 'Rua das Empresas, 123 - Centro', '(11) 9999-8888', 'contato@empresaexemplo.com.br'),
('Empresa Federal RJ', '11.111.111/0001-11', 'Av. Brasil, 1000 - Centro', '(21) 3000-0001', 'contato@empresafederal.rj.gov.br'),
('Empresa Estadual SP', '22.222.222/0001-22', 'Av. Paulista, 2000 - Bela Vista', '(11) 4000-0002', 'contato@empresaestadual.sp.gov.br'),
('Empresa Municipal BH', '33.333.333/0001-33', 'Av. Afonso Pena, 3000 - Centro', '(31) 5000-0003', 'contato@empresamunicipal.bh.gov.br'),
('Empresa Pública DF', '44.444.444/0001-44', 'Eixo Monumental, 4000 - Zona Cívico-Administrativa', '(61) 6000-0004', 'contato@empresapublica.df.gov.br'),
('Empresa Regional PE', '55.555.555/0001-55', 'Av. Conde da Boa Vista, 5000 - Centro', '(81) 7000-0005', 'contato@empresaregional.pe.gov.br'),
('Empresa Segurança MG', '66.666.666/0001-66', 'Rua da Bahia, 6000 - Centro', '(31) 8000-0006', 'contato@empresaseguranca.mg.gov.br'),
('Empresa Fiscal RJ', '77.777.777/0001-77', 'Av. Rio Branco, 7000 - Centro', '(21) 9000-0007', 'contato@empresafiscal.rj.gov.br'),
('Empresa Logística BA', '88.888.888/0001-88', 'Av. Sete de Setembro, 8000 - Comércio', '(71) 9100-0008', 'contato@empresalogistica.ba.gov.br'),
('Empresa Saúde SP', '99.999.999/0001-99', 'Rua da Consolação, 9000 - Consolação', '(11) 9200-0009', 'contato@empresasaude.sp.gov.br'),
('Empresa Educação RS', '10.101.010/0001-10', 'Av. Borges de Medeiros, 10000 - Centro', '(51) 9300-0010', 'contato@empresaeducacao.rs.gov.br'),
('Empresa Ambiente PR', '12.121.212/0001-12', 'Rua XV de Novembro, 11000 - Centro', '(41) 9400-0011', 'contato@empresaambiente.pr.gov.br'),
('Empresa Transporte CE', '13.131.313/0001-13', 'Av. Beira Mar, 12000 - Meireles', '(85) 9500-0012', 'contato@empresatransporte.ce.gov.br'),
('Empresa Cultura PE', '14.141.414/0001-14', 'Rua da Aurora, 13000 - Casa Forte', '(81) 9600-0013', 'contato@empresacultura.pe.gov.br'),
('Empresa Infra RJ', '15.151.515/0001-15', 'Av. das Américas, 14000 - Barra', '(21) 9700-0014', 'contato@empresainfra.rj.gov.br'),
('Empresa Tecnologia SC', '16.161.616/0001-16', 'Av. Beira Mar, 15000 - Centro', '(48) 9800-0015', 'contato@empresatecnologia.sc.gov.br'),
('Empresa Obras GO', '17.171.717/0001-17', 'Av. Anhanguera, 16000 - Setor Sul', '(62) 9900-0016', 'contato@empresaoobras.go.gov.br'),
('Empresa Trânsito SP', '18.181.818/0001-18', 'Av. Ibirapuera, 17000 - Moema', '(11) 1000-0017', 'contato@empresatransito.sp.gov.br'),
('Empresa Serviços AM', '19.191.919/0001-19', 'Av. Rio Negro, 18000 - Centro', '(92) 1100-0018', 'contato@empresaservicos.am.gov.br'),
('Empresa Fiscalização PA', '20.202.020/0001-20', 'Rua do Comércio, 19000 - Centro', '(91) 1200-0019', 'contato@empresafiscalizacao.pa.gov.br');

-- Inserir unidades de exemplo
INSERT INTO units (name, company_id, address, phone, capacity) VALUES
('Unidade Centro', 1, 'Av. Central, 456 - Centro', '(11) 8888-7777', 50),
('Unidade Federal 1', 2, 'Rua do Comércio, 10 - Centro', '(21) 2100-0001', 80),
('Unidade Estadual 1', 3, 'Av. Paulista, 100 - Bela Vista', '(11) 2100-0002', 90),
('Unidade Municipal 1', 4, 'Av. Afonso Pena, 200 - Centro', '(31) 2100-0003', 60),
('Unidade Pública 1', 5, 'Eixo Monumental, 300 - Zona Cívico', '(61) 2100-0004', 70),
('Unidade Regional 1', 6, 'Av. Boa Vista, 400 - Centro', '(81) 2100-0005', 75),
('Unidade Segurança 1', 7, 'Rua da Bahia, 500 - Centro', '(31) 2100-0006', 80),
('Unidade Fiscal 1', 8, 'Av. Rio Branco, 600 - Centro', '(21) 2100-0007', 85),
('Unidade Logística 1', 9, 'Av. Sete de Setembro, 700 - Comércio', '(71) 2100-0008', 70),
('Unidade Saúde 1', 10, 'Rua da Consolação, 800 - Consolação', '(11) 2100-0009', 90),
('Unidade Educação 1', 11, 'Av. Borges de Medeiros, 900 - Centro', '(51) 2100-0010', 65),
('Unidade Ambiente 1', 12, 'Rua XV de Novembro, 1000 - Centro', '(41) 2100-0011', 60),
('Unidade Transporte 1', 13, 'Av. Beira Mar, 1100 - Meireles', '(85) 2100-0012', 95),
('Unidade Cultura 1', 14, 'Rua da Aurora, 1200 - Casa Forte', '(81) 2100-0013', 50),
('Unidade Infra 1', 15, 'Av. das Américas, 1300 - Barra', '(21) 2100-0014', 100),
('Unidade Tecnologia 1', 16, 'Av. Beira Mar, 1400 - Centro', '(48) 2100-0015', 80),
('Unidade Obras 1', 17, 'Av. Anhanguera, 1500 - Setor Sul', '(62) 2100-0016', 90),
('Unidade Trânsito 1', 18, 'Av. Ibirapuera, 1600 - Moema', '(11) 2100-0017', 65),
('Unidade Serviços 1', 19, 'Av. Rio Negro, 1700 - Centro', '(92) 2100-0018', 70),
('Unidade Fiscalização 1', 20, 'Rua do Comércio, 1800 - Centro', '(91) 2100-0019', 55);

-- Inserir usuários de exemplo
INSERT INTO users (name, email, password_hash, role_id, unit_id) VALUES
('Master Admin', 'master@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 3, NULL),
('Admin Unidade 1', 'admin01@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 2, 1),
('Admin Unidade 2', 'admin02@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 2, 2),
('Admin Unidade 3', 'admin03@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 2, 3),
('Admin Unidade 4', 'admin04@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 2, 4),
('Admin Unidade 5', 'admin05@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 2, 5),
('Admin Unidade 6', 'admin06@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 2, 6),
('Admin Unidade 7', 'admin07@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 2, 7),
('Admin Unidade 8', 'admin08@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 2, 8),
('Admin Unidade 9', 'admin09@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 2, 9),
('Admin Unidade 10', 'admin10@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 2, 10),
('Admin Unidade 11', 'admin11@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 2, 11),
('Admin Unidade 12', 'admin12@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 2, 12),
('Admin Unidade 13', 'admin13@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 2, 13),
('Admin Unidade 14', 'admin14@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 2, 14),
('Admin Unidade 15', 'admin15@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 2, 15),
('Admin Unidade 16', 'admin16@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 2, 16),
('Admin Unidade 17', 'admin17@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 2, 17),
('Admin Unidade 18', 'admin18@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 2, 18),
('Admin Unidade 19', 'admin19@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 2, 19),
('Admin Unidade 20', 'admin20@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 2, 20),
('Usuário 01', 'usuario01@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 1),
('Usuário 02', 'usuario02@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 1),
('Usuário 03', 'usuario03@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 2),
('Usuário 04', 'usuario04@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 2),
('Usuário 05', 'usuario05@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 3),
('Usuário 06', 'usuario06@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 3),
('Usuário 07', 'usuario07@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 4),
('Usuário 08', 'usuario08@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 4),
('Usuário 09', 'usuario09@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 5),
('Usuário 10', 'usuario10@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 5),
('Usuário 11', 'usuario11@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 6),
('Usuário 12', 'usuario12@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 6),
('Usuário 13', 'usuario13@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 7),
('Usuário 14', 'usuario14@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 7),
('Usuário 15', 'usuario15@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 8),
('Usuário 16', 'usuario16@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 8),
('Usuário 17', 'usuario17@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 9),
('Usuário 18', 'usuario18@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 9),
('Usuário 19', 'usuario19@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 10),
('Usuário 20', 'usuario20@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 10),
('Usuário 21', 'usuario21@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 11),
('Usuário 22', 'usuario22@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 11),
('Usuário 23', 'usuario23@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 12),
('Usuário 24', 'usuario24@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 12),
('Usuário 25', 'usuario25@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 13),
('Usuário 26', 'usuario26@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 13),
('Usuário 27', 'usuario27@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 14),
('Usuário 28', 'usuario28@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 14),
('Usuário 29', 'usuario29@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 15),
('Usuário 30', 'usuario30@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 15),
('Usuário 31', 'usuario31@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 16),
('Usuário 32', 'usuario32@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 16),
('Usuário 33', 'usuario33@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 17),
('Usuário 34', 'usuario34@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 17),
('Usuário 35', 'usuario35@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 18),
('Usuário 36', 'usuario36@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 18),
('Usuário 37', 'usuario37@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 19),
('Usuário 38', 'usuario38@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 19),
('Usuário 39', 'usuario39@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 20),
('Usuário 40', 'usuario40@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 20),
('Usuário 41', 'usuario41@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 1),
('Usuário 42', 'usuario42@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 2),
('Usuário 43', 'usuario43@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 3),
('Usuário 44', 'usuario44@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 4),
('Usuário 45', 'usuario45@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 5),
('Usuário 46', 'usuario46@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 6),
('Usuário 47', 'usuario47@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 7),
('Usuário 48', 'usuario48@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 8),
('Usuário 49', 'usuario49@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 9),
('Usuário 50', 'usuario50@alipen.com', '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm', 1, 10);

-- Inserir solicitações de exemplo
INSERT INTO lunch_requests (user_id, unit_id, quantity, request_date, status, notes) VALUES
(3, 1, 2, CURDATE(), 'pending', 'Quentinhas para reunião da manhã'),
(4, 1, 1, CURDATE(), 'approved', 'Almoço individual'),
(5, 1, 3, CURDATE(), 'delivered', 'Para equipe de desenvolvimento');

-- Criar tabela de registros pendentes de aprovação
CREATE TABLE IF NOT EXISTS pending_registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  unit_id INT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  reviewed_by INT NULL,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_unit_id (unit_id),
  INDEX idx_requested_at (requested_at)
);

-- Criar tabela de pedidos diários
CREATE TABLE IF NOT EXISTS daily_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_date DATE NOT NULL,
  unit_id INT NOT NULL,
  total_requests INT NOT NULL DEFAULT 0,
  total_quantity INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_order_date_unit (order_date, unit_id),
  INDEX idx_daily_order_date (order_date),
  INDEX idx_daily_order_unit (unit_id)
);

-- Inserir pedidos diários de exemplo
INSERT INTO daily_orders (order_date, unit_id, total_requests, total_quantity) VALUES
('2026-04-01', 1, 14, 42),
('2026-04-02', 2, 18, 54),
('2026-04-03', 3, 12, 36),
('2026-04-04', 4, 20, 60),
('2026-04-05', 5, 15, 45),
('2026-04-06', 6, 22, 66),
('2026-04-07', 7, 17, 51),
('2026-04-08', 8, 19, 57),
('2026-04-09', 9, 16, 48),
('2026-04-10', 10, 21, 63),
('2026-04-11', 11, 13, 39),
('2026-04-12', 12, 25, 75),
('2026-04-13', 13, 18, 54),
('2026-04-14', 14, 23, 69),
('2026-04-15', 15, 20, 60),
('2026-04-16', 16, 14, 42),
('2026-04-17', 17, 19, 57),
('2026-04-18', 18, 22, 66),
('2026-04-19', 19, 17, 51),
('2026-04-20', 20, 24, 72);
