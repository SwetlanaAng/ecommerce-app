import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRouterPaths } from '../../../routes/AppRouterPathsEnums';
import { useAuth } from './useAuth';
import handleLogin from '../../../services/handleLogin';

interface UseLoginSubmitProps {
  formData: {
    email: string;
    password: string;
  };
  setError: (error: string) => void;
}

export const useLoginSubmit = ({ formData, setError }: UseLoginSubmitProps) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = useCallback(async () => {
    setError('');
    try {
      const userData = await handleLogin(formData.email, formData.password);
      login(userData);
      navigate(AppRouterPaths.MAIN);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Incorrect email or password');
    }
  }, [formData, setError, login, navigate]);

  return onSubmit;
};
