import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import './Header.css';
import { AppRouterPaths } from '../../routes/AppRouterPathsEnums';

const links = [
  {
    path: AppRouterPaths.HOME,
    text: 'Главная',
  },
  {
    path: AppRouterPaths.LOGIN,
    text: 'Вход',
  },
  {
    path: AppRouterPaths.REGISTER,
    text: 'Регистрация',
  },
];

interface HeaderProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    closeMobileMenu();
  }, [location]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to={AppRouterPaths.HOME}>
              <img src={logo} alt="logo" />
            </Link>
          </div>

          <div className={`hamburger ${mobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          {mobileMenuOpen && <div className="menu-overlay" onClick={closeMobileMenu}></div>}

          <nav className={`nav ${mobileMenuOpen ? 'active' : ''}`}>
            <ul>
              {links.map(link => (
                <li className={isActive(link.path)} key={link.path}>
                  <Link to={link.path} onClick={closeMobileMenu}>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
