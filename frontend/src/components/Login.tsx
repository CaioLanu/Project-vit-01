import { useState } from 'react';
import '../styles/Login.css';

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export default function Login() {
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: LoginResponse = await response.json();

      if (data.success) {
        setSuccess(true);
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        // Simular redirecionamento após 1.5 segundos
        setTimeout(() => {
          // Em um app real, você usaria React Router
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        setError(data.message || 'Erro ao fazer login');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor. Verifique se o backend está rodando em http://localhost:5000');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="login-box">
        <div className="login-header">
          <img src="/policia-penal-rj-logo.jpeg" alt="Polícia Penal RJ" className="app-logo" />
          <h1>ALIPEN</h1>
          <p className="subtitle">Bem-vindo de volta</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">
              Login realizado com sucesso! Redirecionando...
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">@</span>
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
            <label htmlFor="password">Senha</label>
            <div className="input-wrapper">
              <span className="input-icon">&#9679;</span>
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

          <button type="submit" className="login-button" disabled={loading}>
            <span className="button-text">
              {loading ? 'Autenticando...' : 'Entrar'}
            </span>
            <div className="button-glow"></div>
          </button>
        </form>

        <div className="login-footer">
          <a href="#forgot">Esqueceu a senha?</a>
          <span className="separator">•</span>
          <a href="/register">Criar conta</a>
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
