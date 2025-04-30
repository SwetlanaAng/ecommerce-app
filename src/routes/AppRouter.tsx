import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/home/Home';
import Login from '../pages/login/Login';
import Register from '../pages/register/Register';
import Header from '../components/header/Header';
import { AppRouterPaths } from './AppRouterPathsEnums';
import NotFound from '../pages/notFound/NotFound';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path={AppRouterPaths.HOME} element={<Home />} />
              <Route path={AppRouterPaths.LOGIN} element={<Login />} />
              <Route path={AppRouterPaths.REGISTER} element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;
