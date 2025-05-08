import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from '../pages/main/Main';
import Login from '../pages/login/Login';
import Register from '../pages/register/Register';
import Header from '../components/header/Header';
import { AppRouterPaths } from './AppRouterPathsEnums';
import NotFound from '../pages/notFound/NotFound';
import { AuthProvider } from '../features/auth/context/AuthContext';
import AuthGuard from '../features/auth/guards/AuthGuard';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <div className="container">
              <Routes>
                <Route path={AppRouterPaths.MAIN} element={<Main />} />
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
