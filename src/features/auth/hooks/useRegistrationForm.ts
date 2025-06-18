import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormFields } from '../../../schemas/signInSchema';
import { AddressData, initialAddress } from '../../../types/address.types';

export const useRegistrationForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    getValues,
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  });

  const [addressData, setAddressData] = useState<AddressData>({
    billingAddress: { ...initialAddress },
    shippingAddress: { ...initialAddress },
  });

  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
      setValue(name as keyof FormFields, value, { shouldValidate: true });
    },
    [setValue]
  );

  const handleAddressChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const [addressType, fieldName] = name.split('_');

      if (addressType === 'billing' || addressType === 'shipping') {
        setAddressData(prev => {
          const newData = {
            ...prev,
            [`${addressType}Address`]: {
              ...prev[`${addressType}Address` as keyof typeof prev],
              [fieldName]: value,
            },
          };

          if (sameAsShipping && addressType === 'billing') {
            newData.shippingAddress = {
              ...newData.shippingAddress,
              [fieldName]: value,
            };
            setValue(`shipping_${fieldName}` as keyof FormFields, value, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            });
          }

          return newData;
        });
        setValue(name as keyof FormFields, value, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    },
    [sameAsShipping, setValue]
  );

  const handleSameAddressChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setSameAsShipping(checked);

      if (checked) {
        const billingAddress = addressData.billingAddress;
        setAddressData(prev => ({
          ...prev,
          shippingAddress: {
            ...billingAddress,
          },
        }));

        setValue('shipping_city', billingAddress.city || '', {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue('shipping_street', billingAddress.street || '', {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue('shipping_postalCode', billingAddress.postalCode || '', {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue('shipping_isDefault', billingAddress.isDefault || false, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      } else {
        const currentValues = getValues();

        setAddressData(prev => ({
          ...prev,
          shippingAddress: { ...initialAddress },
        }));

        reset(
          {
            ...currentValues,
            shipping_city: '',
            shipping_street: '',
            shipping_postalCode: '',
            shipping_isDefault: false,
            sameAsShipping: false,
          },
          {
            keepErrors: false,
            keepDirty: false,
            keepTouched: false,
          }
        );
      }
    },
    [addressData.billingAddress, setValue, reset, getValues]
  );

  const handleDefaultAddressChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name } = e.target;
      const [addressType] = name.split('_');

      setAddressData(prev => {
        const newData = {
          ...prev,
          [`${addressType}Address`]: {
            ...prev[`${addressType}Address` as keyof typeof prev],
            isDefault: e.target.checked,
          },
        };

        if (sameAsShipping && addressType === 'billing') {
          newData.shippingAddress = {
            ...newData.shippingAddress,
            isDefault: e.target.checked,
          };
        }

        return newData;
      });
      setValue(name as keyof FormFields, e.target.checked, { shouldValidate: true });
    },
    [sameAsShipping, setValue]
  );

  return {
    formData,
    addressData,
    sameAsShipping,
    isLoading,
    errors,
    isSubmitting,
    register,
    handleSubmit,
    handleChange,
    handleAddressChange,
    handleSameAddressChange,
    handleDefaultAddressChange,
    setIsLoading,
  };
};
