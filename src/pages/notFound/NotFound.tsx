import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRouterPaths } from '../../routes/AppRouterPathsEnums';
import notFound from '../../assets/notFound.png';
import Button from '../../components/header/button/Button';
import './NotFound.css';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <h1>Извините, страница не найдена</h1>
      <img src={notFound} alt="notFound" />
      <Button onClick={() => navigate(AppRouterPaths.HOME)}>Вернуться на главную</Button>
    </div>
  );
};

export default NotFound;
