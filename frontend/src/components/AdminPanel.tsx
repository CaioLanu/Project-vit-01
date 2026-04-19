import { useState, useEffect } from 'react';
import '../styles/AdminPanel.css';

interface PendingRegistration {
  id: number;
  name: string;
  email: string;
  unit_name: string;
  unit_id: number;
  status: string;
  requested_at: string;
  reviewed_at: string | null;
  reviewed_by_name: string | null;
  rejection_reason: string | null;
}

export default function AdminPanel() {
  const [registrations, setRegistrations] = useState<PendingRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPendingRegistrations();
    const interval = setInterval(fetchPendingRegistrations, 30000); // Atualizar a cada 30s
    return () => clearInterval(interval);
  }, []);

  const fetchPendingRegistrations = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/pending-registrations', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setRegistrations(data.pending_registrations);
        setError('');
      } else {
        setError(data.message || 'Erro ao carregar registros pendentes');
      }
    } catch (err) {
      setError('Erro de conexão ao carregar registros');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      setSuccess('');
      setError('');
      const response = await fetch(`http://localhost:5000/api/pending-registrations/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'approved',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Registro aprovado com sucesso!');
        setSelectedRegistration(null);
        await fetchPendingRegistrations();
      } else {
        setError(data.message || 'Erro ao aprovar registro');
      }
    } catch (err) {
      setError('Erro de conexão ao aprovar registro');
      console.error(err);
    }
  };

  const handleReject = async (id: number) => {
    if (!rejectionReason.trim()) {
      setError('Informe um motivo para a rejeição');
      return;
    }

    try {
      setSuccess('');
      setError('');
      const response = await fetch(`http://localhost:5000/api/pending-registrations/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'rejected',
          rejection_reason: rejectionReason,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Registro rejeitado com sucesso!');
        setSelectedRegistration(null);
        setRejectionReason('');
        await fetchPendingRegistrations();
      } else {
        setError(data.message || 'Erro ao rejeitar registro');
      }
    } catch (err) {
      setError('Erro de conexão ao rejeitar registro');
      console.error(err);
    }
  };

  const filteredRegistrations = filterStatus
    ? registrations.filter((reg) => reg.status === filterStatus)
    : registrations;

  const pendingCount = registrations.filter((reg) => reg.status === 'pending').length;
  const approvedCount = registrations.filter((reg) => reg.status === 'approved').length;
  const rejectedCount = registrations.filter((reg) => reg.status === 'rejected').length;

  return (
    <div className="admin-panel-container">
      <div className="admin-header">
        <h1>Painel de Administração</h1>
        <p>Gerenciar solicitações de cadastro</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number pending">{pendingCount}</div>
          <div className="stat-label">Pendentes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number approved">{approvedCount}</div>
          <div className="stat-label">Aprovados</div>
        </div>
        <div className="stat-card">
          <div className="stat-number rejected">{rejectedCount}</div>
          <div className="stat-label">Rejeitados</div>
        </div>
      </div>

      <div className="filter-section">
        <label htmlFor="statusFilter">Filtrar por status:</label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="">Todos</option>
          <option value="pending">Pendentes</option>
          <option value="approved">Aprovados</option>
          <option value="rejected">Rejeitados</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Carregando registros...</div>
      ) : filteredRegistrations.length === 0 ? (
        <div className="no-data">
          Nenhum registro {filterStatus ? `com status "${filterStatus}"` : 'encontrado'}
        </div>
      ) : (
        <div className="registrations-list">
          {filteredRegistrations.map((registration) => (
            <div key={registration.id} className={`registration-card ${registration.status}`}>
              <div className="registration-header">
                <h3>{registration.name}</h3>
                <span className={`status-badge ${registration.status}`}>{registration.status}</span>
              </div>

              <div className="registration-info">
                <p><strong>Email:</strong> {registration.email}</p>
                <p><strong>Unidade:</strong> {registration.unit_name}</p>
                <p><strong>Solicitado em:</strong> {new Date(registration.requested_at).toLocaleString()}</p>

                {registration.status !== 'pending' && (
                  <>
                    <p><strong>Revisado por:</strong> {registration.reviewed_by_name}</p>
                    <p><strong>Revisado em:</strong> {registration.reviewed_at ? new Date(registration.reviewed_at).toLocaleString() : 'N/A'}</p>
                    {registration.rejection_reason && (
                      <p><strong>Motivo da rejeição:</strong> {registration.rejection_reason}</p>
                    )}
                  </>
                )}
              </div>

              {registration.status === 'pending' && (
                <div className="registration-actions">
                  <button
                    className="btn btn-approve"
                    onClick={() => handleApprove(registration.id)}
                    disabled={selectedRegistration === registration.id}
                  >
                    ✓ Aprovar
                  </button>
                  <button
                    className="btn btn-reject"
                    onClick={() => setSelectedRegistration(
                      selectedRegistration === registration.id ? null : registration.id
                    )}
                  >
                    ✗ Rejeitar
                  </button>
                </div>
              )}

              {selectedRegistration === registration.id && registration.status === 'pending' && (
                <div className="rejection-form">
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Informe o motivo da rejeição..."
                    className="rejection-textarea"
                  />
                  <div className="rejection-actions">
                    <button
                      className="btn btn-confirm"
                      onClick={() => handleReject(registration.id)}
                    >
                      Confirmar Rejeição
                    </button>
                    <button
                      className="btn btn-cancel"
                      onClick={() => {
                        setSelectedRegistration(null);
                        setRejectionReason('');
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
