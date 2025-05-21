import { useEffect, useState } from 'react';
import Button from '../../../button/Button';
import Input from '../../../input/Input';
import './EditPersonalInformationContent.css';
import { getCustomer, updateCustomerProfile } from '../../../../services/profile.service';
import { CustomerInfo } from '../../../../types/interfaces';
import { FieldErrors, UseFormRegister, SubmitHandler } from 'react-hook-form';
import { editPersonalInfoModal } from '../../../../schemas/editPersonalInfoSchema';

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
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstNameEdited, setIsFirstNameEdited] = useState(false);
  const [isLastNameEdited, setIsLastNameEdited] = useState(false);
  const [isEmailEdited, setIsEmailEdited] = useState(false);
  const [isDateEdited, setIsDateEdited] = useState(false);
  const [customer, setCustomer] = useState<CustomerInfo>({
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    addresses: [],
    shippingAddressIds: [],
    billingAddressIds: [],
    dateOfBirth: '',
    version: 0,
  });

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const data = await getCustomer();
        setCustomer(data);
      } catch (err) {
        setError(
          `Error loading profile information. ${err instanceof Error ? err.message : String(err)}`
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomerData();
  }, []);
  console.log(customer);
  console.log(customer.id);
  const onSubmit: SubmitHandler<editPersonalInfoModal> = async data => {
    try {
      setError(null);
      const customerData = {
        firstName: isFirstNameEdited ? data.firstName : customer.firstName,
        lastName: isLastNameEdited ? data.lastName : customer.lastName,
        email: isEmailEdited ? data.email : customer.email,
        dateOfBirth: isDateEdited ? data.dateOfBirth : customer.dateOfBirth,
      };
      await updateCustomerProfile(customerData);

      if (onSuccess) {
        onSuccess();
      } else {
        alert('Profile updated successfully!');
      }
    } catch (err) {
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
  if (isLoading) {
    return (
      <div className="edit-personal">
        <p>Loading personal information...</p>
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
          value={isFirstNameEdited ? formData.firstName : customer.firstName}
          register={register}
          onChange={e => {
            setIsFirstNameEdited(true);
            onChange(e);
          }}
          disabled={isDisabled}
          error={errors.firstName}
        ></Input>
        <Input
          labelText="Last Name"
          name="lastName"
          id="lastName"
          value={isLastNameEdited ? formData.lastName : customer.lastName}
          onChange={e => {
            setIsLastNameEdited(true);
            onChange(e);
          }}
          register={register}
          disabled={isDisabled}
          error={errors.lastName}
        ></Input>
        <Input
          labelText="Email"
          name="email"
          id="email"
          value={isEmailEdited ? formData.email : customer.email}
          onChange={e => {
            setIsEmailEdited(true);
            onChange(e);
          }}
          register={register}
          disabled={isDisabled}
          error={errors.email}
        ></Input>
        <Input
          labelText="Date of birth"
          type="date"
          name="dateOfBirth"
          id="dateOfBirth"
          value={isDateEdited ? formData.dateOfBirth : customer.dateOfBirth}
          onChange={e => {
            setIsDateEdited(true);
            onChange(e);
          }}
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
