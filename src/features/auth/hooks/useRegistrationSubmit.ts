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
  setIsLoading: (isLoading: boolean) => void;
}

export const useRegistrationSubmit = ({
  formData,
  addressData,
  setIsLoading,
}: UseRegistrationSubmitProps) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const submitData: SubmitHandler<FormFields> = useCallback(async () => {
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
          Have a nice shopping experience`
        );
        login({
          id: result.message,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
        navigate(AppRouterPaths.MAIN);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  }, [formData, addressData, setIsLoading, login, navigate]);

  return submitData;
};
