import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import Input from '../input/Input';
import { FormFields } from '../../schemas/signInSchema';

interface PersonalInfoFormProps {
  formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  };
  isDisabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<FormFields>;
  errors: FieldErrors<FormFields>;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  formData,
  isDisabled,
  onChange,
  register,
  errors,
}) => {
  return (
    <>
      <Input
        labelText="Email"
        name="email"
        id="email"
        onChange={onChange}
        type="text"
        placeholder="user@example.com"
        value={formData.email}
        disabled={isDisabled}
        register={register}
        error={errors.email}
        autoComplete="email"
      />

      <Input
        labelText="Password"
        name="password"
        id="password"
        onChange={onChange}
        type="password"
        placeholder="••••••••"
        value={formData.password}
        disabled={isDisabled}
        register={register}
        error={errors.password}
        autoComplete="new-password"
      />

      <Input
        labelText="First Name"
        name="firstName"
        id="firstName"
        onChange={onChange}
        placeholder="John"
        value={formData.firstName}
        disabled={isDisabled}
        register={register}
        error={errors.firstName}
        autoComplete="given-name"
      />

      <Input
        labelText="Last Name"
        name="lastName"
        id="lastName"
        onChange={onChange}
        placeholder="Doe"
        value={formData.lastName}
        disabled={isDisabled}
        register={register}
        error={errors.lastName}
        autoComplete="family-name"
      />

      <Input
        labelText="Birth date"
        name="dateOfBirth"
        type="date"
        id="date"
        onChange={onChange}
        placeholder="dd/mm/yyyy"
        value={formData.dateOfBirth}
        disabled={isDisabled}
        autoComplete="bday"
        register={register}
        error={errors.dateOfBirth}
      />
    </>
  );
};

export default PersonalInfoForm;
