import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Address } from '../../../types/address.types';
import {
  BillingAddressSchema,
  ShippingAddressSchema,
  BillingAddressModal,
  ShippingAddressModal,
} from '../../../schemas/aditAddressSchema';

export const useBillingAddressForm = (data?: Address) => {
  const initialFormData: BillingAddressModal = {
    billing_country: data?.country || 'US',
    billing_city: data?.city || '',
    billing_street: data?.street || '',
    billing_postalCode: data?.postalCode || '',
    billing_isDefault: data?.isDefault || false,
  };

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    reset,
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

export const useShippingAddressForm = (data?: Address) => {
  const initialFormData: ShippingAddressModal = {
    shipping_country: data?.country || 'US',
    shipping_city: data?.city || '',
    shipping_street: data?.street || '',
    shipping_postalCode: data?.postalCode || '',
    shipping_isDefault: data?.isDefault || false,
  };

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<ShippingAddressModal>({
    resolver: zodResolver(ShippingAddressSchema),
    mode: 'onTouched',
    defaultValues: initialFormData,
  });

  const [formData, setFormData] = useState<ShippingAddressModal>(initialFormData);

  useEffect(() => {
    Object.entries(initialFormData).forEach(([key, value]) => {
      setValue(key as keyof ShippingAddressModal, value, { shouldValidate: true });
    });
  }, [setValue]);

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
