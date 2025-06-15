import './Footer.css';
import { Link } from 'react-router-dom';
import { AppRouterPaths } from '../../routes/AppRouterPathsEnums';
import { useAuth } from '../../features/auth/hooks/useAuth';
import logo from '../../assets/logo.svg';

const Footer = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="row">
            <div className="nav">
              <ul>
                <li>
                  <Link to={AppRouterPaths.MAIN}>Main</Link>
                </li>
                <li>
                  <Link to={AppRouterPaths.CATALOG}>Catalog</Link>
                </li>
                <li>
                  <Link to={AppRouterPaths.ABOUT_US}>About</Link>
                </li>
                <li>
                  <Link to={AppRouterPaths.BASKET}>Basket</Link>
                </li>
                {isAuthenticated && (
                  <li>
                    <Link to={AppRouterPaths.PROFILE}>Profile</Link>
                  </li>
                )}
                {!isAuthenticated && (
                  <>
                    <li>
                      <Link to={AppRouterPaths.REGISTER}>Register</Link>
                    </li>
                    <li>
                      <Link to={AppRouterPaths.LOGIN}>Login</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className="contact">
              <div className="contact-info">info@macaron-shop.com</div>
              <div className="copyright">
                © 2025, Macaron Delights. All rights reserved.
                <br />
                Made with ❤️ by GitInit Team
              </div>
            </div>
            <div className="logo">
              <img src={logo} alt="logo" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
