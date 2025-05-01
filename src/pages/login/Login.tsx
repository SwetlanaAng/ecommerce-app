import React from 'react';
import { Link } from 'react-router-dom';
import { AppRouterPaths } from '../../routes/AppRouterPathsEnums';

const Login: React.FC = () => {
  return (
    <div className="auth-page">
      <h1>Вход</h1>
      <div className="auth-links">
        <p>
          Нет аккаунта? <Link to={AppRouterPaths.REGISTER}>Регистрация</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
