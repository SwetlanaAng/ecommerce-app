import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppRouterPaths } from '../../routes/AppRouterPathsEnums';
import { useAuth } from '../../features/auth/hooks/useAuth';
import handleLogin from '../../services/handleLogin';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import './Login.css';
import { loginSchema, LoginInput } from '../../schemas/authSchemas';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Partial<LoginInput>>({});
  const [isLoading, setIsLoading] = useState(false);

  const emailSchema = loginSchema.shape.email;
  const passwordSchema = loginSchema.shape.password;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');

    if (name === 'email') {
      const result = emailSchema.safeParse(value);
      setFieldErrors(prev => ({
        ...prev,
        email: result.success ? undefined : result.error.issues[0].message,
      }));
    }

    if (name === 'password') {
      const result = passwordSchema.safeParse(value);
      setFieldErrors(prev => ({
        ...prev,
        password: result.success ? undefined : result.error.issues[0].message,
      }));
    }
  };

  const isFormValid =
    formData.email.trim() !== '' &&
    formData.password.trim() !== '' &&
    !fieldErrors.email &&
    !fieldErrors.password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
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
          autoComplete="off"
        />
        {fieldErrors.email && <div className="error-message">{fieldErrors.email}</div>}

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
        {fieldErrors.password && <div className="error-message">{fieldErrors.password}</div>}

        <Button
          className="submit-button"
          disabled={!isFormValid || isLoading}
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
