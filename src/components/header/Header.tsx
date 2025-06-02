import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { AppRouterPaths } from '../../routes/AppRouterPathsEnums';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useCart } from '../../features/cart/hooks/useCart';
import { CartIcon } from '../../components/cartIcon/CartIcon';
import './Header.css';

interface HeaderProps {
  isMobileMenuOpen?: boolean;
  toggleMobileMenu?: () => void;
  closeMobileMenu?: () => void;
}

interface NavLink {
  path: string;
  text: string;
  isLogout?: boolean;
  cart?: boolean;
}

const Header: React.FC<HeaderProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { cartItemsCount } = useCart();
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
      {
        path: AppRouterPaths.ABOUT_US,
        text: 'About',
      },
    ];

    if (isAuthenticated) {
      navLinks.push({
        path: AppRouterPaths.PROFILE,
        text: 'Profile',
      });
    } else {
      navLinks.push({
        path: AppRouterPaths.REGISTER,
        text: 'Register',
      });
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

          <nav className={`nav ${mobileMenuOpen ? 'active' : ''}`}>
            <ul>
              {navLinks.map((link, index) => (
                <li className={isActive(link.path)} key={index}>
                  <Link to={link.path} onClick={closeMobileMenu}>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            <div className="header-actions-item">
              <Link to={AppRouterPaths.BASKET}>
                <CartIcon title="cart" count={cartItemsCount} />
              </Link>
            </div>
            {isAuthenticated ? (
              <a onClick={handleLogout} className="logout-link">
                Log out
              </a>
            ) : (
              <Link to={AppRouterPaths.LOGIN} className="login-link">
                Log in
              </Link>
            )}
          </div>

          {mobileMenuOpen && <div className="menu-overlay" onClick={closeMobileMenu}></div>}
          <div
            className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            role="button"
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
