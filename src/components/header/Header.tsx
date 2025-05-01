import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import './Header.css';
import { AppRouterPaths } from '../../routes/AppRouterPathsEnums';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to={AppRouterPaths.HOME}>
              <img src={logo} alt="logo" />
            </Link>
          </div>
          <nav className="nav">
            <ul>
              <li className={isActive(AppRouterPaths.HOME)}>
                <Link to={AppRouterPaths.HOME}>Главная</Link>
              </li>
              <li className={isActive(AppRouterPaths.LOGIN)}>
                <Link to={AppRouterPaths.LOGIN}>Вход</Link>
              </li>
              <li className={isActive(AppRouterPaths.REGISTER)}>
                <Link to={AppRouterPaths.REGISTER}>Регистрация</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
