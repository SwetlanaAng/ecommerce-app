import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditAddressModal, EditAddressSchema } from '../../../schemas/editAddressSchema';

export const useNewAddressForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<EditAddressModal>({
    resolver: zodResolver(EditAddressSchema),
    mode: 'onChange',
    defaultValues: {
      city: '',
      street: '',
      postalCode: '',
      isDefault: false,
    } /* ,
    reValidateMode: 'onChange', */,
  });

  const [formData, setFormData] = useState({
    country: '',
    city: '',
    street: '',
    postalCode: '',
    isDefault: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleAddressChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
      setValue(name as keyof EditAddressModal, value, { shouldValidate: true });
    },
    [setValue]
  );

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
      setValue(name as keyof EditAddressModal, value, { shouldValidate: true });
    },
    [setValue]
  );

  return {
    formDataAddAddress: formData,
    isLoading,
    errorsAddAddress: errors,
    isSubmittingAddAddress: isSubmitting,
    registerAddAddress: register,
    handleSubmit,
    handleChange,
    handleAddressChangeAddAddress: handleAddressChange,
    setIsLoading,
  };
};
