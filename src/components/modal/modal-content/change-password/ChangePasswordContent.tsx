import { FieldErrors, SubmitHandler, UseFormRegister } from 'react-hook-form';
import Button from '../../../button/Button';
import Input from '../../../input/Input';
import './ChangePasswordContent.css';
import { ChangePasswordModal } from '../../../../schemas/changePasswordSchemas';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { ChangePassword } from '../../../../services/profile.service';

interface ChangePasswordFormProps {
  formData: ChangePasswordModal;
  isDisabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<ChangePasswordModal>;
  errors: FieldErrors<ChangePasswordModal>;
  reset: () => void;
  onSuccess?: () => void;
  onCancel?: () => void;
  handleSubmit?: (
    onSubmit: SubmitHandler<ChangePasswordModal>
  ) => (e: React.BaseSyntheticEvent) => void;
}

export const ChangePasswordContent: React.FC<ChangePasswordFormProps> = ({
  formData,
  isDisabled,
  onChange,
  register,
  reset,
  errors,
  handleSubmit,
  onSuccess,
}) => {
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<ChangePasswordModal> = async data => {
    try {
      setError(null);
      await ChangePassword(data);
      reset();
      if (onSuccess) {
        onSuccess();
        toast.success('Password changed successfully!');
      }
    } catch (err) {
      toast.error(`Failed to change password`);
      setError(`Failed to change password: ${err instanceof Error ? err.message : String(err)}`);
      console.log(error);
    }
  };

  return (
    <div className="edit-password">
      <h3>Change password</h3>
      <form
        onSubmit={handleSubmit ? handleSubmit(onSubmit) : e => e.preventDefault()}
        className="edit-password-form"
      >
        <Input
          id="password"
          register={register}
          labelText="Current Password"
          placeholder="••••••••"
          type="password"
          disabled={isDisabled}
          name="currentPassword"
          value={formData.currentPassword}
          onChange={onChange}
          error={errors.currentPassword}
          autoComplete="off"
        ></Input>
        <Input
          id="new-password"
          register={register}
          labelText="New Password"
          placeholder="••••••••"
          type="password"
          disabled={isDisabled}
          name="newPassword"
          value={formData.newPassword}
          onChange={onChange}
          error={errors.newPassword}
          autoComplete="off"
        ></Input>
        <Button className="submit-button " type="submit">
          Change Password
        </Button>
      </form>
    </div>
  );
};
