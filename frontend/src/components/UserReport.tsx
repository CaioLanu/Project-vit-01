import { useState, useEffect } from 'react';
import '../styles/UserReport.css';

interface User {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

interface UnitReport {
  unit_id: number;
  unit_name: string;
  company_id: number;
  company_name: string;
  users: User[];
}

export default function UserReport() {
  const [report, setReport] = useState<UnitReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedUnit, setExpandedUnit] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingUserId, setProcessingUserId] = useState<number | null>(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUserReport();
  }, []);

  const fetchUserReport = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/reports/users-by-unit', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setReport(data.report_by_unit);
        setError('');
      } else {
        setError(data.message || 'Erro ao carregar relatório');
      }
    } catch (err) {
      setError('Erro de conexão ao carregar relatório');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportToCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Empresa,Unidade,Total de Usuários,Usuários Ativos\n';

    report.forEach((unit) => {
      const activeUsers = unit.users.filter((u) => u.is_active).length;
      csvContent += `"${unit.company_name}","${unit.unit_name}",${unit.users.length},${activeUsers}\n`;

      unit.users.forEach((user) => {
        csvContent += `,"",${user.name} (${user.email}),${user.is_active ? 'Ativo' : 'Inativo'}\n`;
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio-usuarios-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      setProcessingUserId(userId);
      const response = await fetch(`http://localhost:5000/api/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: !currentStatus,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        await fetchUserReport();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Erro ao atualizar status do usuário');
      }
    } catch (err) {
      setError('Erro de conexão ao atualizar usuário');
      console.error(err);
    } finally {
      setProcessingUserId(null);
    }
  };

  const filteredReport = report.map((unit) => ({
    ...unit,
    users: unit.users.filter((user) =>
      searchTerm === '' ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((unit) => unit.users.length > 0 || searchTerm === '');

  const totalUsers = report.reduce((sum, unit) => sum + unit.users.length, 0);
  const totalActive = report.reduce(
    (sum, unit) => sum + unit.users.filter((u) => u.is_active).length,
    0
  );

  return (
    <div className="user-report-container">
      <div className="report-header">
        <h1>Relatório de Usuários</h1>
        <p>Controle de usuários por unidade</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {success && <div className="alert alert-success">{success}</div>}

      <div className="report-stats">
        <div className="stat-box">
          <div className="stat-value">{report.length}</div>
          <div className="stat-label">Unidades</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{totalUsers}</div>
          <div className="stat-label">Usuários Totais</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{totalActive}</div>
          <div className="stat-label">Usuários Ativos</div>
        </div>
      </div>

      <div className="report-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="btn-export" onClick={handleExportToCSV}>
          📊 Exportar para CSV
        </button>
      </div>

      {loading ? (
        <div className="loading">Carregando relatório...</div>
      ) : filteredReport.length === 0 ? (
        <div className="no-data">Nenhum usuário encontrado</div>
      ) : (
        <div className="units-container">
          {filteredReport.map((unit) => (
            <div key={unit.unit_id} className="unit-section">
              <button
                className="unit-header-btn"
                onClick={() => setExpandedUnit(expandedUnit === unit.unit_id ? null : unit.unit_id)}
              >
                <div className="unit-info">
                  <h3>{unit.unit_name}</h3>
                  <p className="company-name">{unit.company_name}</p>
                </div>
                <div className="unit-stats">
                  <span className="user-count">{unit.users.length} usuários</span>
                  <span className="expand-icon">{expandedUnit === unit.unit_id ? '▼' : '▶'}</span>
                </div>
              </button>

              {expandedUnit === unit.unit_id && (
                <div className="users-list">
                  <div className="users-header">
                    <div className="col col-name">Nome</div>
                    <div className="col col-email">Email</div>
                    <div className="col col-status">Status</div>
                    <div className="col col-joined">Data de Cadastro</div>
                  </div>
                  {unit.users.map((user) => (
                    <div key={user.id} className="user-row">
                      <div className="col col-name">{user.name}</div>
                      <div className="col col-email">{user.email}</div>
                      <div className="col col-status">
                        <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                          {user.is_active ? 'Ativo' : 'Bloqueado'}
                        </span>
                      </div>
                      <div className="col col-joined">
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="col col-actions">
                        <button
                          className={`btn-toggle-status ${user.is_active ? 'btn-block' : 'btn-unblock'}`}
                          onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                          disabled={processingUserId === user.id}
                        >
                          {processingUserId === user.id
                            ? '...'
                            : user.is_active
                            ? '🔒 Bloquear'
                            : '🔓 Desbloquear'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
