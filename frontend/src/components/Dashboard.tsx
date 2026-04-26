import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  unit_name?: string;
}

interface LunchRequest {
  id: number;
  quantity: number;
  request_date: string;
  status: string;
  notes?: string;
  user_name: string;
  unit_name: string;
  created_at: string;
}

interface DailyOrder {
  order_date: string;
  total_requests: number;
  total_quantity: number;
  unit_name: string;
  company_name: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeMenu, setActiveMenu] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [lunchRequests, setLunchRequests] = useState<LunchRequest[]>([]);
  const [dailyOrders, setDailyOrders] = useState<DailyOrder[]>([]);
  const [units, setUnits] = useState<Array<{ id: number; name: string; company_name?: string }>>([]);
  const [reportFilters, setReportFilters] = useState({
    start_date: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    unit_id: ''
  });
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');
  const [newRequest, setNewRequest] = useState({
    quantity: 1,
    request_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUnits();
      if (activeMenu === 'reports') {
        fetchDailyOrders();
      }
    }
  }, [user, activeMenu]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/';
        return;
      }

      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        if (data.user.role === 'user') {
          fetchLunchRequests();
        }
      } else {
        localStorage.removeItem('token');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      localStorage.removeItem('token');
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/units', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUnits(data.units);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar unidades:', error);
    }
  };

  const fetchLunchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/lunch-requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setLunchRequests(data.requests);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
    }
  };

  const fetchDailyOrders = async () => {
    try {
      setReportLoading(true);
      setReportError('');
      const token = localStorage.getItem('token');
      const queryParams = [];

      if (reportFilters.start_date) {
        queryParams.push(`start_date=${reportFilters.start_date}`);
      }
      if (reportFilters.end_date) {
        queryParams.push(`end_date=${reportFilters.end_date}`);
      }
      if (reportFilters.unit_id) {
        queryParams.push(`unit_id=${reportFilters.unit_id}`);
      }

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const response = await fetch(`http://localhost:5000/api/reports/daily-orders${queryString}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setDailyOrders(data.daily_orders);
      } else {
        setReportError(data.message || 'Erro ao carregar relatório');
      }
    } catch (error) {
      console.error('Erro ao buscar relatórios diários:', error);
      setReportError('Erro ao carregar dados do relatório');
    } finally {
      setReportLoading(false);
    }
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchDailyOrders();
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/logout', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
  };

  const handleNewRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/lunch-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newRequest)
      });

      if (response.ok) {
        alert('Solicitação criada com sucesso!');
        setNewRequest({
          quantity: 1,
          request_date: new Date().toISOString().split('T')[0],
          notes: ''
        });
        fetchLunchRequests();
      } else {
        const error = await response.json();
        alert(error.message || 'Erro ao criar solicitação');
      }
    } catch (error) {
      console.error('Erro ao criar solicitação:', error);
      alert('Erro ao criar solicitação');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ffaa00';
      case 'approved': return '#00f5a0';
      case 'rejected': return '#ff006e';
      case 'delivered': return '#00aaff';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovada';
      case 'rejected': return 'Rejeitada';
      case 'delivered': return 'Entregue';
      default: return status;
    }
  };

  const renderMenuContent = () => {
    if (user?.role === 'user') {
      // Menu para usuários comuns
      switch (activeMenu) {
        case 'profile':
          return (
            <div className="menu-content">
              <h2>Perfil do Usuário</h2>
              <div className="profile-info">
                <div className="info-item">
                  <label>Nome:</label>
                  <span>{user?.name}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{user?.email}</span>
                </div>
                <div className="info-item">
                  <label>Unidade:</label>
                  <span>{user?.unit_name || 'Não atribuída'}</span>
                </div>
                <div className="info-item">
                  <label>Permissão:</label>
                  <span>Solicitante</span>
                </div>
              </div>
            </div>
          );
        case 'requests':
          return (
            <div className="menu-content">
              <h2>Minhas Solicitações</h2>
              <div className="requests-section">
                <div className="new-request-form">
                  <h3>Nova Solicitação</h3>
                  <form onSubmit={handleNewRequest}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Quantidade:</label>
                        <input
                          type="number"
                          min="1"
                          value={newRequest.quantity}
                          onChange={(e) => setNewRequest({...newRequest, quantity: parseInt(e.target.value)})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Data:</label>
                        <input
                          type="date"
                          value={newRequest.request_date}
                          onChange={(e) => setNewRequest({...newRequest, request_date: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Observações:</label>
                      <textarea
                        value={newRequest.notes}
                        onChange={(e) => setNewRequest({...newRequest, notes: e.target.value})}
                        placeholder="Observações opcionais..."
                      />
                    </div>
                    <button type="submit" className="btn-primary">Solicitar Quentinhas</button>
                  </form>
                </div>

                <div className="requests-list">
                  <h3>Histórico de Solicitações</h3>
                  <div className="requests-grid">
                    {lunchRequests.map(request => (
                      <div key={request.id} className="request-card">
                        <div className="request-header">
                          <span className="request-date">{new Date(request.request_date).toLocaleDateString('pt-BR')}</span>
                          <span className="request-status" style={{color: getStatusColor(request.status)}}>
                            {getStatusText(request.status)}
                          </span>
                        </div>
                        <div className="request-body">
                          <p><strong>Quantidade:</strong> {request.quantity} quentinhas</p>
                          {request.notes && <p><strong>Observações:</strong> {request.notes}</p>}
                          <p className="request-time">
                            Solicitado em: {new Date(request.created_at).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        case 'reports':
          return (
            <div className="menu-content">
              <h2>Meus Relatórios</h2>
              <div className="reports-section">
                <div className="report-filters">
                  <h3>Período de análise</h3>
                  <form onSubmit={handleGenerateReport} className="filter-row">
                    <div className="form-group">
                      <label>Data Inicial:</label>
                      <input
                        type="date"
                        value={reportFilters.start_date}
                        onChange={(e) => setReportFilters(prev => ({ ...prev, start_date: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Data Final:</label>
                      <input
                        type="date"
                        value={reportFilters.end_date}
                        onChange={(e) => setReportFilters(prev => ({ ...prev, end_date: e.target.value }))}
                      />
                    </div>
                    <button type="submit" className="btn-primary">Gerar Relatório</button>
                  </form>
                </div>

                <div className="report-card">
                  <h3>Pedidos Diários</h3>
                  {reportError && <div className="error-message">{reportError}</div>}
                  {reportLoading ? (
                    <p>Carregando relatório...</p>
                  ) : dailyOrders.length === 0 ? (
                    <p>Selecione o período e clique em gerar relatório para visualizar os pedidos diários.</p>
                  ) : (
                    <>
                      <div className="stats-grid">
                        <div className="stat-item">
                          <span className="stat-number">{dailyOrders.reduce((sum, item) => sum + item.total_requests, 0)}</span>
                          <span className="stat-label">Pedidos no período</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-number">{dailyOrders.reduce((sum, item) => sum + item.total_quantity, 0)}</span>
                          <span className="stat-label">Quantidade total</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-number">{dailyOrders.length}</span>
                          <span className="stat-label">Dias com registro</span>
                        </div>
                      </div>

                      <div className="chart-container">
                        {dailyOrders.map((order) => {
                          const maxRequests = Math.max(...dailyOrders.map(item => item.total_requests), 1);
                          const height = (order.total_requests / maxRequests) * 100;
                          return (
                            <div key={`${order.order_date}-${order.unit_name}`} className="chart-bar">
                              <div className="bar-fill" style={{ height: `${height}%` }} title={`${order.total_requests} pedidos`}></div>
                              <span className="chart-label">{new Date(order.order_date).toLocaleDateString('pt-BR')}</span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        default:
          return null;
      }
    } else {
      // Menu para admin/master
      switch (activeMenu) {
        case 'profile':
          return (
            <div className="menu-content">
              <h2>Perfil Administrativo</h2>
              <div className="profile-info">
                <div className="info-item">
                  <label>Nome:</label>
                  <span>{user?.name}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{user?.email}</span>
                </div>
                <div className="info-item">
                  <label>Permissão:</label>
                  <span>{user?.role === 'master' ? 'Master' : 'Administrador'}</span>
                </div>
              </div>
            </div>
          );
        case 'management':
          return (
            <div className="menu-content">
              <h2>Gestão do Sistema</h2>
              <div className="management-grid">
                <div className="management-card">
                  <h3>🏢 Empresas</h3>
                  <p>Gerenciar empresas cadastradas</p>
                  <button className="btn-secondary">Ver Empresas</button>
                </div>
                <div className="management-card">
                  <h3>🏭 Unidades</h3>
                  <p>Criar e gerenciar unidades</p>
                  <button className="btn-secondary">Ver Unidades</button>
                </div>
                <div className="management-card">
                  <h3>👥 Usuários</h3>
                  <p>Administrar usuários do sistema</p>
                  <button className="btn-secondary">Ver Usuários</button>
                </div>
                <div className="management-card">
                  <h3>🍽️ Solicitações</h3>
                  <p>Aprovar solicitações de quentinhas</p>
                  <button className="btn-secondary">Ver Solicitações</button>
                </div>
              </div>
            </div>
          );
        case 'reports':
          return (
            <div className="menu-content">
              <h2>Relatórios Administrativos</h2>
              <div className="reports-section">
                <div className="report-filters">
                  <h3>Filtros</h3>
                  <form onSubmit={handleGenerateReport} className="filter-row">
                    <div className="form-group">
                      <label>Data Inicial:</label>
                      <input
                        type="date"
                        value={reportFilters.start_date}
                        onChange={(e) => setReportFilters(prev => ({ ...prev, start_date: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Data Final:</label>
                      <input
                        type="date"
                        value={reportFilters.end_date}
                        onChange={(e) => setReportFilters(prev => ({ ...prev, end_date: e.target.value }))}
                      />
                    </div>
                    {user?.role === 'master' && (
                      <div className="form-group">
                        <label>Unidade:</label>
                        <select
                          value={reportFilters.unit_id || ''}
                          onChange={(e) => setReportFilters(prev => ({ ...prev, unit_id: e.target.value }))}
                        >
                          <option value="">Todas as unidades</option>
                          {units.map(unit => (
                            <option key={unit.id} value={unit.id}>{unit.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <button type="submit" className="btn-primary">Gerar Relatório</button>
                  </form>
                </div>

                <div className="report-card">
                  <h3>Pedidos Diários</h3>
                  {reportError && <div className="error-message">{reportError}</div>}
                  {reportLoading ? (
                    <p>Carregando relatório...</p>
                  ) : dailyOrders.length === 0 ? (
                    <p>Selecione o período e clique em gerar relatório para visualizar os pedidos diários.</p>
                  ) : (
                    <>
                      <div className="stats-grid">
                        <div className="stat-item">
                          <span className="stat-number">{dailyOrders.reduce((sum, item) => sum + item.total_requests, 0)}</span>
                          <span className="stat-label">Pedidos no período</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-number">{dailyOrders.reduce((sum, item) => sum + item.total_quantity, 0)}</span>
                          <span className="stat-label">Quantidade total</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-number">{dailyOrders.length}</span>
                          <span className="stat-label">Dias com registro</span>
                        </div>
                      </div>

                      <div className="chart-container">
                        {dailyOrders.map((order) => {
                          const maxRequests = Math.max(...dailyOrders.map(item => item.total_requests), 1);
                          const height = (order.total_requests / maxRequests) * 100;
                          return (
                            <div key={`${order.order_date}-${order.unit_name}`} className="chart-bar">
                              <div className="bar-fill" style={{ height: `${height}%` }} title={`${order.total_requests} pedidos`}></div>
                              <span className="chart-label">{new Date(order.order_date).toLocaleDateString('pt-BR')}</span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        default:
          return null;
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <img src="/policia-penal-rj-logo.jpeg" alt="Polícia Penal RJ" className="header-logo" />
          <div className="brand-info">
            <h1>ALIPEN</h1>
            <span className="subtitle">Sistema de Alimentação</span>
          </div>
        </div>
        <div className="header-right">
          <span className="welcome-user">Olá, {user?.name}!</span>
          <span className="user-role">({user?.role === 'master' ? 'Master' : user?.role === 'admin' ? 'Admin' : 'Usuário'})</span>
          <button onClick={handleLogout} className="btn-logout">
            Sair
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="sidebar">
          <nav className="menu-nav">
            <button
              className={`menu-item ${activeMenu === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveMenu('profile')}
            >
              <span className="menu-icon">👤</span>
              Perfil
            </button>

            {user?.role === 'user' ? (
              <>
                <button
                  className={`menu-item ${activeMenu === 'requests' ? 'active' : ''}`}
                  onClick={() => setActiveMenu('requests')}
                >
                  <span className="menu-icon">🍽️</span>
                  Solicitações
                </button>
                <button
                  className={`menu-item ${activeMenu === 'reports' ? 'active' : ''}`}
                  onClick={() => setActiveMenu('reports')}
                >
                  <span className="menu-icon">📊</span>
                  Relatórios
                </button>
              </>
            ) : (
              <>
                <button
                  className={`menu-item ${activeMenu === 'management' ? 'active' : ''}`}
                  onClick={() => setActiveMenu('management')}
                >
                  <span className="menu-icon">⚙️</span>
                  Gestão
                </button>
                <button
                  className={`menu-item ${activeMenu === 'reports' ? 'active' : ''}`}
                  onClick={() => setActiveMenu('reports')}
                >
                  <span className="menu-icon">📊</span>
                  Relatórios
                </button>
              </>
            )}
          </nav>
        </div>

        <div className="main-content">
          {renderMenuContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;