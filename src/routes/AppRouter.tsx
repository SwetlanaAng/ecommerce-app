import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '../components/header/Header';
import { AppRouterPaths } from './AppRouterPathsEnums';
import { AuthProvider } from '../features/auth/context/AuthContext';
import { AppProvider } from '../features/app/context/AppContext';
import AuthGuard from '../features/auth/guards/AuthGuard';
import Loader from '../components/loader/Loader';

const Main = lazy(() => import('../pages/main/Main'));
const Login = lazy(() => import('../pages/login/Login'));
const Register = lazy(() => import('../pages/register/Register'));
const Catalog = lazy(() => import('../pages/catalog/Catalog'));
const Profile = lazy(() => import('../pages/profile/Profile'));
const ProductDetails = lazy(() => import('../pages/product/ProductDetails'));
const NotFound = lazy(() => import('../pages/notFound/NotFound'));

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <AppProvider>
          <div className="app-container">
            <Header />
            <main className="main-content">
              <div className="container">
                <Suspense fallback={<Loader size="large" />}>
                  <Routes>
                    <Route path={AppRouterPaths.MAIN} element={<Main />} />
                    <Route path={AppRouterPaths.CATALOG} element={<Catalog />} />
                    <Route path={AppRouterPaths.PRODUCT_DETAILS} element={<ProductDetails />} />
                    <Route
                      path={AppRouterPaths.LOGIN}
                      element={
                        <AuthGuard requireAuth={false}>
                          <Login />
                        </AuthGuard>
                      }
                    />
                    <Route
                      path={AppRouterPaths.REGISTER}
                      element={
                        <AuthGuard requireAuth={false}>
                          <Register />
                        </AuthGuard>
                      }
                    />
                    <Route
                      path={AppRouterPaths.PROFILE}
                      element={
                        <AuthGuard requireAuth={true}>
                          <Profile />
                        </AuthGuard>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
            </main>
          </div>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
