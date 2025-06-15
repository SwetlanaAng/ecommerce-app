import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRouterPaths } from '../../routes/AppRouterPathsEnums';
import notFound from '../../assets/404.mp4';
import Button from '../../components/button/Button';
import './NotFound.css';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-page-wrapper">
        <video src={notFound} role="video" autoPlay loop muted />
        <h1>Uh-oh... I think I took a wrong turn</h1>
        <p>Let's get you back to where the cute things live</p>
        <Button onClick={() => navigate(AppRouterPaths.MAIN)}>Go Home</Button>
      </div>
    </div>
  );
};

export default NotFound;
