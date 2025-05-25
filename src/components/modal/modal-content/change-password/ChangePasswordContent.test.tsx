import { UseFormRegister } from 'react-hook-form';
import { render, screen } from '@testing-library/react';
import { ChangePasswordContent } from './ChangePasswordContent';
import { ChangePasswordModal } from '../../../../schemas/changePasswordSchemas';
const mockRegister = jest.fn(() => ({ onChange: jest.fn(), onBlur: jest.fn(), ref: jest.fn() }));

describe('ChangePasswordContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const formData = {
    currentPassword: '',
    newPassword: '',
  };

  const errors = {};

  const onChange = jest.fn();
  const reset = jest.fn();
  const handleSubmit = jest.fn();
  const onSuccess = jest.fn();

  it('renders currentPassword and newPassword inputs with correct props', () => {
    render(
      <ChangePasswordContent
        formData={formData}
        isDisabled={false}
        onChange={onChange}
        register={mockRegister as unknown as UseFormRegister<ChangePasswordModal>}
        reset={reset}
        errors={errors}
        handleSubmit={handleSubmit}
        onSuccess={onSuccess}
      ></ChangePasswordContent>
    );

    const currentInput = screen.getByLabelText('Password') as HTMLInputElement;
    const newInput = screen.getByLabelText('New Password') as HTMLInputElement;

    expect(currentInput).toBeInTheDocument();
    expect(newInput).toBeInTheDocument();
  });
});
