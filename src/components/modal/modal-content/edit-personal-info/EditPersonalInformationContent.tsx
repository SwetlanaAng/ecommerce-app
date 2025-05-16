import { useEffect, useState } from 'react';
import Button from '../../../button/Button';
import Input from '../../../input/Input';
import './EditPersonalInformationContent.css';
import { getCustomer } from '../../../../services/profile.service';
import { CustomerInfo } from '../../../../types/interfaces';

export const EditPersonalInformationContent = () => {
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
      <form className="edit-personal-form">
        <Input
          labelText="First Name"
          name="firstName"
          id="firstName"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        ></Input>
        <Input
          labelText="Last Name"
          name="lastName"
          id="lastName"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        ></Input>
        <Input
          labelText="Email"
          name="email"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        ></Input>
        <Input
          labelText="Date of birth"
          type="date"
          name="dateOfBirth"
          id="dateOfBirth"
          value={dateOfBirth}
          onChange={e => setDateOfBirth(e.target.value)}
        ></Input>
        <Button className="submit-button " type="submit">
          Save changes
        </Button>
      </form>
    </div>
  );
};
