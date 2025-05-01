import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppRouterPaths } from '../../routes/AppRouterPathsEnums';
import loginCustomer from '../../shared/api/loginCustomer';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const loginData = {
        email: formData.email,
        password: formData.password,
      };

      const response = await loginCustomer(loginData);
      console.log('Login successful:', response);

      localStorage.setItem('currentUser', JSON.stringify(response.body.customer));

      navigate(AppRouterPaths.HOME);
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Неверный email или пароль');
    }
  };

  return (
    <div className="auth-page">
      <h1>Вход</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Войти
        </button>
      </form>

      <div className="auth-links">
        <p>
          Нет аккаунта? <Link to={AppRouterPaths.REGISTER}>Регистрация</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
