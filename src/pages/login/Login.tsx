import React from 'react';
import { Link } from 'react-router-dom';
import { AppRouterPaths } from '../../routes/AppRouterPathsEnums';
import Button from '../../components/button/Button';
import './Login.css';
import { useLoginForm } from '../../features/auth/hooks/useLoginForm';
import { useLoginSubmit } from '../../features/auth/hooks/useLoginSubmit';
import LoginForm from '../../components/login/LoginForm';

const Login: React.FC = () => {
  const {
    formData /* , error */,
    errors,
    isSubmitting,
    register,
    handleSubmit,
    handleChange,
    setError,
  } = useLoginForm();

  const onSubmit = useLoginSubmit({
    formData,
    setError,
  });

  return (
    <div className="login-page">
      <h1>Log in</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
        {/* {error && <div className="error-message">{error}</div>} */}

        <LoginForm
          formData={formData}
          isDisabled={isSubmitting}
          onChange={handleChange}
          register={register}
          errors={errors}
        />

        <Button className="submit-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Entering...' : 'Log in'}
        </Button>
      </form>

      <div className="auth-links">
        Don't you have an account? <Link to={AppRouterPaths.REGISTER}>Register</Link>
      </div>
    </div>
  );
};

export default Login;
