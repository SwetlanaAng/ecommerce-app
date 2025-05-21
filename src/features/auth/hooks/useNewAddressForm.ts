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
    },
  });

  const [formBillingData, setFormBillingData] = useState({
    country: '',
    city: '',
    street: '',
    postalCode: '',
    isDefault: false,
  });
  const [formShippingData, setFormShippingData] = useState({
    country: '',
    city: '',
    street: '',
    postalCode: '',
    isDefault: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleShippingAddressChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormShippingData(prev => ({
        ...prev,
        [name]: value,
      }));
      setValue(name as keyof EditAddressModal, value, { shouldValidate: true });
    },
    [setValue]
  );
  const handleBillingAddressChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormBillingData(prev => ({
        ...prev,
        [name]: value,
      }));
      setValue(name as keyof EditAddressModal, value, { shouldValidate: true });
    },
    [setValue]
  );

  const handleShippingChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormShippingData(prev => ({
        ...prev,
        [name]: value,
      }));
      setValue(name as keyof EditAddressModal, value, { shouldValidate: true });
    },
    [setValue]
  );
  const handleBillingChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormBillingData(prev => ({
        ...prev,
        [name]: value,
      }));
      setValue(name as keyof EditAddressModal, value, { shouldValidate: true });
    },
    [setValue]
  );

  return {
    formDataAddBilling: formBillingData,
    formDataAddShipping: formShippingData,
    isLoading,
    errorsAdd: errors,
    isSubmittingAdd: isSubmitting,
    registerAdd: register,
    handleSubmitAdd: handleSubmit,
    handleBillingChange,
    handleShippingChange,
    handleBillingChangeAdd: handleBillingAddressChange,
    handleShippingChangeAdd: handleShippingAddressChange,
    setIsLoading,
  };
};
