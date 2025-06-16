import { useState } from 'react';
import Button from '../../../button/Button';
import Input from '../../../input/Input';
import { FieldErrors, UseFormRegister, SubmitHandler } from 'react-hook-form';
import { editPersonalInfoModal } from '../../../../schemas/editPersonalInfoSchema';
import { toast } from 'react-toastify';
import { updateCustomerProfile } from '../../../../services/profilePersonal.service';
import { useAuth } from '../../../../features/auth/hooks/useAuth';

type EditPersonalInfoProps = {
  formData: {
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  };
  isDisabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<editPersonalInfoModal>;
  errors: FieldErrors<editPersonalInfoModal>;
  handleSubmit?: (
    onSubmit: SubmitHandler<editPersonalInfoModal>
  ) => (e: React.BaseSyntheticEvent) => void;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export const EditPersonalInformationContent = ({
  formData,
  isDisabled,
  onChange,
  register,
  errors,
  handleSubmit,
  onSuccess,
}: EditPersonalInfoProps) => {
  const [error, setError] = useState<string | null>(null);
  const { updateUser } = useAuth();

  const onSubmit: SubmitHandler<editPersonalInfoModal> = async data => {
    try {
      setError(null);

      const updatedProfile = await updateCustomerProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
      });

      updateUser({
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        email: updatedProfile.email,
        dateOfBirth: updatedProfile.dateOfBirth,
      });

      if (onSuccess) {
        onSuccess();
        toast.success('Profile updated successfully!');
        document.body.style.overflow = 'auto';
      }
    } catch (err) {
      toast.error(`Failed to update profile`);
      setError(`Failed to update profile: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  if (error) {
    return (
      <div className="edit-personal">
        <p>{error}</p>
      </div>
    );
  }
  return (
    <div className="edit-personal">
      <h3>Edit personal information</h3>
      <form
        onSubmit={handleSubmit ? handleSubmit(onSubmit) : e => e.preventDefault()}
        className="edit-personal-form"
      >
        <Input
          labelText="First Name"
          name="firstName"
          id="firstName"
          value={formData.firstName}
          register={register}
          onChange={onChange}
          disabled={isDisabled}
          error={errors.firstName}
        ></Input>
        <Input
          labelText="Last Name"
          name="lastName"
          id="lastName"
          value={formData.lastName}
          onChange={onChange}
          register={register}
          disabled={isDisabled}
          error={errors.lastName}
        ></Input>
        <Input
          labelText="Email"
          name="email"
          id="email"
          value={formData.email}
          onChange={onChange}
          register={register}
          disabled={isDisabled}
          error={errors.email}
        ></Input>
        <Input
          labelText="Birth date"
          type="date"
          name="dateOfBirth"
          id="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={onChange}
          disabled={isDisabled}
          register={register}
          error={errors.dateOfBirth}
        ></Input>
        <Button className="submit-button" type="submit" disabled={isDisabled}>
          Save changes
        </Button>
      </form>
    </div>
  );
};
