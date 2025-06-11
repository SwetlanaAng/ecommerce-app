import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { AppRouterPaths } from '../../routes/AppRouterPathsEnums';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useCart } from '../../features/cart/hooks/useCart';
import { CartIcon } from '../../components/cartIcon/CartIcon';
import logoutIcon from '../../assets/logout.svg';
import loginIcon from '../../assets/login.svg';
import profileIcon from '../../assets/profile.svg';
import settingsIcon from '../../assets/settings.svg';
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
  const { isAuthenticated, logout, user } = useAuth();
  const { cartItemsCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const closeProfileDropdown = () => {
    setProfileDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate(AppRouterPaths.MAIN);
    closeMobileMenu();
    closeProfileDropdown();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeProfileDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    closeMobileMenu();
    closeProfileDropdown();
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

    if (!isAuthenticated) {
      navLinks.push({
        path: AppRouterPaths.REGISTER,
        text: 'Register',
      });
    }

    return navLinks;
  };

  const navLinks = getNavLinks();

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.email) {
      return user.email;
    }
    return 'User';
  };

  const getUserEmail = () => {
    return user?.email || '';
  };

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
              <div className="profile-dropdown" ref={dropdownRef}>
                <button
                  className="profile-trigger"
                  onClick={toggleProfileDropdown}
                  aria-label="Profile menu"
                >
                  <img src={profileIcon} alt="profile" />
                </button>
                {profileDropdownOpen && (
                  <div className="profile-dropdown-menu">
                    <div className="profile-dropdown-header">
                      <div className="profile-info">
                        <div className="profile-name">{getDisplayName()}</div>
                        <div className="profile-email">{getUserEmail()}</div>
                      </div>
                    </div>
                    <div className="profile-dropdown-body">
                      <Link
                        to={AppRouterPaths.PROFILE}
                        className="profile-dropdown-item"
                        onClick={closeProfileDropdown}
                      >
                        <img src={settingsIcon} alt="settings" />
                        Account settings
                      </Link>
                      <button className="profile-dropdown-item logout-item" onClick={handleLogout}>
                        <img src={logoutIcon} alt="logout" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to={AppRouterPaths.LOGIN} className="login-link">
                <img src={loginIcon} alt="login" />
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
