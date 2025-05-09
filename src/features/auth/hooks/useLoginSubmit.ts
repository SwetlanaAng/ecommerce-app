import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRouterPaths } from '../../../routes/AppRouterPathsEnums';
import { useAuth } from './useAuth';
import handleLogin from '../../../services/handleLogin';
import { toast } from 'react-toastify';

interface UseLoginSubmitProps {
  formData: {
    email: string;
    password: string;
  };
}

export const useLoginSubmit = ({ formData }: UseLoginSubmitProps) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = useCallback(async () => {
    try {
      const userData = await handleLogin(formData.email, formData.password);
      login(userData);
      toast.success(
        `You have successfully logged in.
        Happy shopping`
      );
      navigate(AppRouterPaths.MAIN);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Incorrect email or password');
    }
  }, [formData, login, navigate]);

  return onSubmit;
};
