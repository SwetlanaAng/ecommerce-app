import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BillingAddressSchema,
  ShippingAddressSchema,
  BillingAddressModal,
  ShippingAddressModal,
} from '../../../schemas/aditAddressSchema';

export const useAddBillingAddressForm = () => {
  const initialFormData: BillingAddressModal = {
    billing_country: 'US',
    billing_city: '',
    billing_street: '',
    billing_postalCode: '',
    billing_isDefault: false,
  };

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    reset: resetForm,
  } = useForm<BillingAddressModal>({
    resolver: zodResolver(BillingAddressSchema),
    mode: 'onTouched',
    defaultValues: initialFormData,
  });

  const [formData, setFormData] = useState<BillingAddressModal>(initialFormData);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const newValue =
        e.target instanceof HTMLInputElement && e.target.type === 'checkbox'
          ? e.target.checked
          : value;

      setFormData(prev => ({
        ...prev,
        [name]: newValue,
      }));

      setValue(
        name as keyof BillingAddressModal,
        newValue as BillingAddressModal[keyof BillingAddressModal],
        { shouldValidate: true }
      );
    },
    [setValue]
  );

  const reset = useCallback(() => {
    resetForm();
    setFormData(initialFormData);
  }, [resetForm]);

  return {
    formData,
    handleChange,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    reset,
  };
};

export const useAddShippingAddressForm = () => {
  const initialFormData: ShippingAddressModal = {
    shipping_country: 'US',
    shipping_city: '',
    shipping_street: '',
    shipping_postalCode: '',
    shipping_isDefault: false,
  };

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    reset: resetForm,
  } = useForm<ShippingAddressModal>({
    resolver: zodResolver(ShippingAddressSchema),
    mode: 'onTouched',
    defaultValues: initialFormData,
  });

  const [formData, setFormData] = useState<ShippingAddressModal>(initialFormData);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const newValue =
        e.target instanceof HTMLInputElement && e.target.type === 'checkbox'
          ? e.target.checked
          : value;

      setFormData(prev => ({
        ...prev,
        [name]: newValue,
      }));

      setValue(
        name as keyof ShippingAddressModal,
        newValue as ShippingAddressModal[keyof ShippingAddressModal],
        { shouldValidate: true }
      );
    },
    [setValue]
  );

  const reset = useCallback(() => {
    resetForm();
    setFormData(initialFormData);
  }, [resetForm]);

  return {
    formData,
    handleChange,
    register,
    handleSubmit,
    errors,
    reset,
    isSubmitting,
  };
};
