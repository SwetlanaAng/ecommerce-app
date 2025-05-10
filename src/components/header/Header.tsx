import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import './Header.css';
import { AppRouterPaths } from '../../routes/AppRouterPathsEnums';
import { useAuth } from '../../features/auth/hooks/useAuth';

interface HeaderProps {
  isMobileMenuOpen?: boolean;
  toggleMobileMenu?: () => void;
  closeMobileMenu?: () => void;
}

interface NavLink {
  path: string;
  text: string;
  isLogout?: boolean;
}

const Header: React.FC<HeaderProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
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

  const handleLogout = () => {
    logout();
    navigate(AppRouterPaths.MAIN);
    closeMobileMenu();
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

  const getNavLinks = (): NavLink[] => {
    const navLinks: NavLink[] = [
      {
        path: AppRouterPaths.MAIN,
        text: 'Main',
      },
      {
        path: AppRouterPaths.CATALOG,
        text: 'Catalog',
      },
    ];

    if (isAuthenticated) {
      navLinks.push(
        {
          path: AppRouterPaths.PROFILE,
          text: 'Profile',
        },
        {
          path: '#',
          text: 'Log out',
          isLogout: true,
        }
      );
    } else {
      navLinks.push(
        {
          path: AppRouterPaths.REGISTER,
          text: 'Register',
        },
        {
          path: AppRouterPaths.LOGIN,
          text: 'Log in',
        }
      );
    }

    return navLinks;
  };

  const navLinks = getNavLinks();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to={AppRouterPaths.MAIN}>
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
              {navLinks.map((link, index) => (
                <li className={isActive(link.path)} key={index}>
                  {link.isLogout ? (
                    <a onClick={handleLogout} className="logout-link">
                      {link.text}
                    </a>
                  ) : (
                    <Link to={link.path} onClick={closeMobileMenu}>
                      {link.text}
                    </Link>
                  )}
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
