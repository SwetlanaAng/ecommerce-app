import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppRouterPaths } from '../../routes/AppRouterPathsEnums';
import { useAuth } from '../../features/auth/hooks/useAuth';
import handleLogin from '../../services/handleLogin';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    try {
      const userData = await handleLogin(formData.email, formData.password);
      login(userData);
      navigate(AppRouterPaths.HOME);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Incorrect email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h1>Log in</h1>
      <form onSubmit={handleSubmit} className="login-form">
        {error && <div className="error-message">{error}</div>}

        <Input
          labelText="Email"
          name="email"
          onChange={handleChange}
          type="email"
          placeholder="user@example.com"
          value={formData.email}
          required={true}
          disabled={isLoading}
        />

        <Input
          labelText="Password"
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="*************"
          value={formData.password}
          required={true}
          disabled={isLoading}
          minLength={8}
        />

        <Button
          className="submit-button"
          disabled={isLoading}
          type="submit"
          children={isLoading ? 'Entering...' : 'Log in'}
        />
      </form>

      <div className="auth-links">
        <p>
          Don't you have an account? <Link to={AppRouterPaths.REGISTER}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
