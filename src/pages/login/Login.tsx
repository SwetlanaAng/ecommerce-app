import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
  const [error, setError] = useState<string>('');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (formData: LoginInput) => {
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

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <>
              <Input
                labelText="Email"
                placeholder="user@example.com"
                autoComplete="off"
                disabled={isSubmitting}
                {...field}
              />
              {errors.email && <div className="error-message">{errors.email.message}</div>}
            </>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <>
              <Input
                labelText="Password"
                placeholder="••••••••"
                type="password"
                disabled={isSubmitting}
                {...field}
              />
              {errors.password && <div className="error-message">{errors.password.message}</div>}
            </>
          )}
        />

        <Button
          className="submit-button"
          disabled={!isValid || isSubmitting}
          type="submit"
          children={isSubmitting ? 'Entering...' : 'Log in'}
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
