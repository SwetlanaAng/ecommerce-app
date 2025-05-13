import { useEffect, useState } from 'react';
import { getCustomer } from '../../services/profile.service';
import { CustomerInfo } from '../../types/interfaces';
import './Profile.css';
import { InfoBox } from '../../components/profile-info-box/InfoBox';
import Button from '../../components/button/Button';
import { AddressBox } from '../../components/address-profile-box/AddressBox';

const Profile: React.FC = () => {
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
  const [defaultBillingId, setDefaultBillingId] = useState('');
  const [defaultShippingId, setDefaultShippingId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      setIsLoading(true);
      try {
        const data = await getCustomer();
        setCustomer(data);

        if (data.defaultBillingAddressId) {
          setDefaultBillingId(data.defaultBillingAddressId);
        }
        if (data.defaultShippingAddressId) {
          setDefaultShippingId(data.defaultShippingAddressId);
        }
      } catch (err) {
        setError('Error loading profile information.' + err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomerData();
  }, []);

  const billingAddress = customer.addresses.find(
    address => address.id === customer.billingAddressIds[0]
  );
  const shippingAddress = customer.addresses.find(
    address => address.id === customer.shippingAddressIds[0]
  );
  if (error) {
    return (
      <div className="profile-page">
        <h1>Profile information</h1>
        <p>{error}</p>
      </div>
    );
  }
  return (
    <div className="profile-page">
      <h1>Profile information</h1>

      <h2>Personal information</h2>

      <InfoBox
        className="first-name"
        spanText="First name: "
        infoText={customer.firstName}
      ></InfoBox>

      <InfoBox className="last-name" spanText="Last name: " infoText={customer.lastName}></InfoBox>

      <InfoBox
        className="birth-date"
        spanText="Date of birth: "
        infoText={customer.dateOfBirth}
      ></InfoBox>

      <h2>Addresses</h2>

      <AddressBox
        headingText="Billing Address"
        addressType="billing"
        country={billingAddress?.country}
        city={billingAddress?.city}
        street={billingAddress?.streetName}
        postalCode={billingAddress?.postalCode}
        defaultId={defaultBillingId}
        addressId={billingAddress?.id}
      ></AddressBox>

      <AddressBox
        headingText="Shipping Address"
        addressType="shipping"
        country={shippingAddress?.country}
        city={shippingAddress?.city}
        street={shippingAddress?.streetName}
        postalCode={shippingAddress?.postalCode}
        defaultId={defaultShippingId}
        addressId={shippingAddress?.id}
      ></AddressBox>

      <Button className="edit">{isLoading ? '...Loading' : 'Edit information'}</Button>
    </div>
  );
};

export default Profile;
