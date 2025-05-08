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
      toast.success(
        `You have successfully logged in.
        Happy shopping`,
        {
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        }
      );
      navigate(AppRouterPaths.MAIN);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Incorrect email or password', {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      setError(err instanceof Error ? err.message : 'Incorrect email or password');
    }
  }, [formData, setError, login, navigate]);

  return onSubmit;
};
