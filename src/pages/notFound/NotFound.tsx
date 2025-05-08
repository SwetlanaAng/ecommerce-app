import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRouterPaths } from '../../routes/AppRouterPathsEnums';
import notFound from '../../assets/notFound.png';
import Button from '../../components/button/Button';
import './NotFound.css';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <h1>Sorry, page not found</h1>
      <img src={notFound} alt="notFound" />
      <Button onClick={() => navigate(AppRouterPaths.MAIN)}>Back to the home page</Button>
    </div>
  );
};

export default NotFound;
