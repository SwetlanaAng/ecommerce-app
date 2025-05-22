import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddAddressModal, AddAddressSchema } from '../../../schemas/addAddressSchema';

export const useNewAddressForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<AddAddressModal>({
    resolver: zodResolver(AddAddressSchema),
    mode: 'onChange',
    defaultValues: {
      billing_city: '',
      billing_street: '',
      billing_postalCode: '',
      billing_isDefault: false,
      shipping_city: '',
      shipping_street: '',
      shipping_postalCode: '',
      shipping_isDefault: false,
    },
  });

  const [formBillingData, setFormBillingData] = useState({
    billing_country: '',
    billing_city: '',
    billing_street: '',
    billing_postalCode: '',
    billing_isDefault: false,
  });
  const [formShippingData, setFormShippingData] = useState({
    shipping_country: '',
    shipping_city: '',
    shipping_street: '',
    shipping_postalCode: '',
    shipping_isDefault: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleShippingAddressChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormShippingData(prev => ({
        ...prev,
        [name]: value,
      }));
      setValue(name as keyof AddAddressModal, value, { shouldValidate: true });
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
      setValue(name as keyof AddAddressModal, value, { shouldValidate: true });
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
      setValue(name as keyof AddAddressModal, value, { shouldValidate: true });
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
      setValue(name as keyof AddAddressModal, value, { shouldValidate: true });
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
