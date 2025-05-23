import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditAddress, Address } from '../../../types/address.types';
import { EditAddressModal, EditAddressSchema } from '../../../schemas/aditAddressSchema';

export const useEditAddressForm = (data?: Address) => {
  let initialShippingFormData: EditAddress,
    initialBillingFormData: EditAddress,
    initialValues: EditAddress;

  if (data) {
    initialShippingFormData = {
      shipping_country: data.country,
      shipping_city: data.city,
      shipping_street: data.street,
      shipping_postalCode: data.postalCode,
      shipping_isDefault: data.isDefault,
    };
    initialBillingFormData = {
      billing_country: data.country,
      billing_city: data.city,
      billing_street: data.street,
      billing_postalCode: data.postalCode,
      billing_isDefault: data.isDefault,
    };
    initialValues = {
      billing_city: data.city,
      billing_street: data.street,
      billing_postalCode: data.postalCode,
      billing_isDefault: data.isDefault,
      shipping_city: data.city,
      shipping_street: data.street,
      shipping_postalCode: data.postalCode,
      shipping_isDefault: data.isDefault,
    };
  } else {
    initialShippingFormData = {
      shipping_country: '',
      shipping_city: '',
      shipping_street: '',
      shipping_postalCode: '',
      shipping_isDefault: false,
    };
    initialBillingFormData = {
      billing_country: '',
      billing_city: '',
      billing_street: '',
      billing_postalCode: '',
      billing_isDefault: false,
    };
    initialValues = {
      billing_city: '',
      billing_street: '',
      billing_postalCode: '',
      billing_isDefault: false,
      shipping_city: '',
      shipping_street: '',
      shipping_postalCode: '',
      shipping_isDefault: false,
    };
  }
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<EditAddressModal>({
    resolver: zodResolver(EditAddressSchema),
    mode: 'onChange',
    defaultValues: initialValues,
  });

  const [formBillingData, setFormBillingData] = useState(initialBillingFormData);
  const [formShippingData, setFormShippingData] = useState(initialShippingFormData);
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
    formDataEditBilling: formBillingData,
    formDataEditShipping: formShippingData,
    isLoading,
    errorsEdit: errors,
    isSubmittingEdit: isSubmitting,
    registerEdit: register,
    handleSubmitEdit: handleSubmit,
    handleBillingChange,
    handleShippingChange,
    handleBillingChangeEdit: handleBillingAddressChange,
    handleShippingChangeEdit: handleShippingAddressChange,
    setIsLoading,
  };
};
