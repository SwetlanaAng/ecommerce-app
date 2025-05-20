import { FieldErrors, UseFormRegister } from 'react-hook-form';
import Button from '../../../button/Button';
import Input from '../../../input/Input';
import './ChangePasswordContent.css';
import { ChangePasswordModal } from '../../../../schemas/changePasswordSchemas';
import { useChangePasswordForm } from '../../../../features/auth/hooks/useChangePasswordForm';

interface ChangePasswordFormProps {
  formData: ChangePasswordModal;
  isDisabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<ChangePasswordModal>;
  errors: FieldErrors<ChangePasswordModal>;
}

export const ChangePasswordContent: React.FC<ChangePasswordFormProps> = ({
  formData,
  isDisabled,
  onChange,
  register,
  errors,
}) => {
  const { handleSubmit } = useChangePasswordForm();
  const onSubmit = () => {};
  return (
    <div className="edit-password">
      <form onSubmit={handleSubmit(onSubmit)} className="edit-password-form">
        <Input
          id="password"
          register={register}
          labelText="Password"
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
