import { useState, useEffect } from 'react';
import '../styles/Register.css';

interface Unit {
  id: number;
  name: string;
  company_name: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  unit_id: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
}

export default function Register() {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    unit_id: '',
  });

  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      setLoadingUnits(true);
      const response = await fetch('http://localhost:5000/api/units');
      const data = await response.json();
      
      if (data.success) {
        setUnits(data.units);
      } else {
        setError('Erro ao carregar unidades');
      }
    } catch (err) {
      setError('Erro de conexão ao carregar unidades');
      console.error(err);
    } finally {
      setLoadingUnits(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não conferem');
      setLoading(false);
      return;
    }

    if (!formData.unit_id) {
      setError('Selecione uma unidade');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          unit_id: parseInt(formData.unit_id),
        }),
      });

      const data: RegisterResponse = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          unit_id: '',
        });
        setTimeout(() => {
          window.location.href = '/login';
        }, 2500);
      } else {
        setError(data.message || 'Erro ao criar conta');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="register-box">
        <div className="register-header">
          <div className="register-icon">
            <div className="icon-glow"></div>
            <span>✨</span>
          </div>
          <h1>CRIAR CONTA</h1>
          <p className="subtitle">Junte-se a nós</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">
              Solicitação enviada com sucesso! Aguarde a aprovação do administrador. Redirecionando...
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Nome Completo</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Seu nome"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <div className="input-glow"></div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <div className="input-glow"></div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="unit_id">Unidade *</label>
            <div className="input-wrapper">
              <span className="input-icon">🏢</span>
              <select
                id="unit_id"
                name="unit_id"
                value={formData.unit_id}
                onChange={handleChange}
                required
                disabled={loading || loadingUnits}
                className="unit-select"
              >
                <option value="">
                  {loadingUnits ? 'Carregando unidades...' : 'Selecione uma unidade'}
                </option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.company_name})
                  </option>
                ))}
              </select>
              <div className="input-glow"></div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="input-wrapper">
              <span className="input-icon">🔐</span>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="sua senha"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <div className="input-glow"></div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <div className="input-wrapper">
              <span className="input-icon">🔐</span>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="confirme sua senha"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <div className="input-glow"></div>
            </div>
          </div>

          <button type="submit" className="register-button" disabled={loading || loadingUnits}>
            <span className="button-text">
              {loading ? 'Enviando solicitação...' : 'Solicitar Cadastro'}
            </span>
            <div className="button-glow"></div>
          </button>
        </form>

        <div className="register-footer">
          <p>Já tem uma conta? <a href="/login">Faça login</a></p>
        </div>
      </div>

      <div className="tech-grid">
        <div className="grid-item"></div>
        <div className="grid-item"></div>
        <div className="grid-item"></div>
        <div className="grid-item"></div>
        <div className="grid-item"></div>
        <div className="grid-item"></div>
      </div>
    </div>
  );
}
