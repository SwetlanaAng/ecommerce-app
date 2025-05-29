import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangePasswordModal, changePasswordSchema } from '../../../schemas/changePasswordSchemas';

export const useChangePasswordForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const {
    handleSubmit,
    register,
    reset: resetForm,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ChangePasswordModal>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
    defaultValues: { currentPassword: '', newPassword: '' },
  });

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
      setValue(name as keyof ChangePasswordModal, value, { shouldValidate: true });
    },
    [setValue]
  );
  const reset = useCallback(() => {
    resetForm();
    setFormData({
      currentPassword: '',
      newPassword: '',
    });
  }, [resetForm]);

  return {
    formData,
    reset,
    errors,
    isSubmitting,
    register,
    handleSubmit,
    handleChange,
  };
};
