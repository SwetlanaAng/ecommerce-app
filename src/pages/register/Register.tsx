import React from 'react';
import { Link } from 'react-router-dom';
import { AppRouterPaths } from '../../routes/AppRouterPathsEnums';

const Register: React.FC = () => {
  return (
    <div className="auth-page">
      <h1>Регистрация</h1>
      <div className="auth-links">
        <p>
          Уже есть аккаунт? <Link to={AppRouterPaths.LOGIN}>Вход</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
