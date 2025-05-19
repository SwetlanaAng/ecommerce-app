import { useEffect, useState } from 'react';
import Button from '../../../button/Button';
import Input from '../../../input/Input';
import './EditPersonalInformationContent.css';
import { getCustomer } from '../../../../services/profile.service';
import { CustomerInfo } from '../../../../types/interfaces';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { editPersonalInfoModal } from '../../../../schemas/editPersonalInfoSchema';
import { useEditPersonalInfoForm } from '../../../../features/auth/hooks/useEditPersonalInfoForm';

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
};
export const EditPersonalInformationContent = ({
  formData,
  isDisabled,
  onChange,
  register,
  errors,
}: EditPersonalInfoProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
  });
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const data = await getCustomer();
        setCustomer(data);
        setFirstName(customer.firstName);
        setLastName(customer.lastName);
        setEmail(customer.email);
        setDateOfBirth(customer.dateOfBirth);
      } catch (err) {
        setError(
          `Error loading profile information. ${err instanceof Error ? err.message : String(err)}`
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomerData();
  }, [customer.firstName, customer.lastName, customer.email, customer.dateOfBirth]);
  const { handleSubmit } = useEditPersonalInfoForm({
    firstName: firstName,
    lastName: lastName,
    email: email,
    dateOfBirth: dateOfBirth,
  });
  const onSubmit = () => {};
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
      <form onSubmit={handleSubmit(onSubmit)} className="edit-personal-form">
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
          labelText="Date of birth"
          type="date"
          name="dateOfBirth"
          id="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={onChange}
          disabled={isDisabled}
          register={register}
          error={errors.dateOfBirth}
        ></Input>
        <Button className="submit-button " type="submit">
          Save changes
        </Button>
      </form>
    </div>
  );
};
