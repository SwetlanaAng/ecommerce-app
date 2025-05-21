import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { /* Customer, */ PersonalInfo } from '../../../types/interfaces';
import {
  editPersonalInfoModal,
  editPersonalInfoSchema,
} from '../../../schemas/editPersonalInfoSchema';

export const useEditPersonalInfoForm = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}') as PersonalInfo;
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    dateOfBirth: user.dateOfBirth,
  });
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<editPersonalInfoModal>({
    resolver: zodResolver(editPersonalInfoSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
    },
  });

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
      setValue(name as keyof editPersonalInfoModal, value, { shouldValidate: true });
    },
    [setValue]
  );

  return {
    formDataPersonal: formData,
    errorsPersonal: errors,
    isSubmittingPersonal: isSubmitting,
    registerPersonal: register,
    handleSubmit: handleSubmit,
    handleChangePersonal: handleChange,
  };
};
