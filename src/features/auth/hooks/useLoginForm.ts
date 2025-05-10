import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '../../../schemas/authSchemas';

export const useLoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
      setValue(name as keyof LoginInput, value, { shouldValidate: true });
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
