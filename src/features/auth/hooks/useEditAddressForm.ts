import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditAddressModal, EditAddressSchema } from '../../../schemas/editAddressSchema';

import { Address } from '../../../types/address.types';

export const useEditAddressForm = (data: Address) => {
  const [formData, setFormData] = useState({
    country: data.country,
    city: data.city,
    street: data.street,
    postalCode: data.postalCode,
    isDefault: data.isDefault,
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<EditAddressModal>({
    resolver: zodResolver(EditAddressSchema),
    mode: 'onChange',
    defaultValues: {
      city: data.city,
      street: data.street,
      postalCode: data.postalCode,
      isDefault: data.isDefault,
    },
  });

  const handleChange = useCallback(
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

  return {
    formData,
    errors,
    isSubmitting,
    register,
    handleSubmit,
    handleChange,
  };
};
