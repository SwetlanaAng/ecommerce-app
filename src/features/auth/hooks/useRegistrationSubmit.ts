import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler } from 'react-hook-form';
import { AppRouterPaths } from '../../../routes/AppRouterPathsEnums';
import { handleRegistration } from '../../../services/handleRegistration';
import { useAuth } from './useAuth';
import { FormFields } from '../../../schemas/signInSchema';
import { AddressData } from '../../../types/address.types';
import { toast } from 'react-toastify';

interface UseRegistrationSubmitProps {
  formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  };
  addressData: AddressData;
  setError: (error: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useRegistrationSubmit = ({
  formData,
  addressData,
  setError,
  setIsLoading,
}: UseRegistrationSubmitProps) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const submitData: SubmitHandler<FormFields> = useCallback(async () => {
    setError('');
    setIsLoading(true);

    try {
      const registrationData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        secondName: formData.lastName,
        date: formData.dateOfBirth,
        billingAddress: addressData.billingAddress,
        shippingAddress: addressData.shippingAddress,
      };

      const result = await handleRegistration(registrationData);

      if (result.isSuccess) {
        toast.success(
          `You have successfully registered.
          Have a nice shopping experience`,
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
        login({
          id: result.message,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
        navigate(AppRouterPaths.MAIN);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  }, [formData, addressData, setError, setIsLoading, login, navigate]);

  return submitData;
};
