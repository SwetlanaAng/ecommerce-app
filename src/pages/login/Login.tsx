import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppRouterPaths } from '../../routes/AppRouterPathsEnums';
import { useAuth } from '../../features/auth/hooks/useAuth';
import handleLogin from '../../services/handleLogin';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { loginSchema, LoginInput } from '../../schemas/authSchemas';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
      setValue(name as keyof LoginInput, value, { shouldValidate: true });
    },
    [setValue]
  );

  const onSubmit = async () => {
    setError('');
    try {
      const userData = await handleLogin(formData.email, formData.password);
      login(userData);
      navigate(AppRouterPaths.HOME);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Incorrect email or password');
    }
  };

  return (
    <div className="login-page">
      <h1>Log in</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
        {error && <div className="error-message">{error}</div>}
        <Input<LoginInput>
          id="email"
          register={register}
          labelText="Email"
          placeholder="user@example.com"
          autoComplete="on"
          disabled={isSubmitting}
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input<LoginInput>
          id="password"
          register={register}
          labelText="Password"
          placeholder="••••••••"
          type="password"
          disabled={isSubmitting}
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Button
          className="submit-button"
          disabled={isSubmitting}
          type="submit"
          children={isSubmitting ? 'Entering...' : 'Log in'}
        />
      </form>

      <div className="auth-links">
        Don't you have an account? <Link to={AppRouterPaths.REGISTER}>Register</Link>
      </div>
    </div>
  );
};

export default Login;
