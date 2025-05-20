import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editAddressModal, editAddressSchema } from '../../../schemas/editAddressSchema';

export const useNewAddressForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<editAddressModal>({
    resolver: zodResolver(editAddressSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
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
      setValue(name as keyof editAddressModal, value, { shouldValidate: true });
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
      setValue(name as keyof editAddressModal, value, { shouldValidate: true });
    },
    [setValue]
  );

  return {
    formData,
    isLoading,
    errors,
    isSubmitting,
    register,
    handleSubmit,
    handleChange,
    handleAddressChange,
    setIsLoading,
  };
};
