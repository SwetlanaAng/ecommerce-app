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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const data = await getCustomer();
        setCustomer(data);

        setDefaultBillingId(data.defaultBillingAddressId || '');
        setDefaultShippingId(data.defaultShippingAddressId || '');
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
  const billingAddresses = customer.addresses.filter(address =>
    customer.billingAddressIds.includes(address.id)
  );
  const shippingAddresses = customer.addresses.filter(address =>
    customer.shippingAddressIds.includes(address.id)
  );
  if (error) {
    return (
      <div className="profile-page">
        <h1>Profile information</h1>
        <p>{error}</p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="profile-page">
        <h1>Profile information</h1>
        <p>Loading profile...</p>
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
      <Button className={isLoading ? 'disabled edit' : 'edit'}>Edit personal information</Button>

      <h2>Addresses</h2>

      <h3>Billing Addresses</h3>

      {billingAddresses.length === 0 ? (
        <p>No billing addresses found</p>
      ) : (
        billingAddresses.map((billingAddress, index) => (
          <AddressBox
            key={index}
            addressNumber={index}
            addressType="billing"
            country={billingAddress?.country}
            city={billingAddress?.city}
            street={billingAddress?.streetName}
            postalCode={billingAddress?.postalCode}
            defaultId={defaultBillingId}
            addressId={billingAddress?.id}
          ></AddressBox>
        ))
      )}

      <Button className={isLoading ? 'disabled edit' : 'edit'}>Edit billing addresses</Button>

      <h3>Shipping Addresses</h3>
      {shippingAddresses.length === 0 ? (
        <p>No shipping addresses found</p>
      ) : (
        shippingAddresses.map((shippingAddress, index) => (
          <AddressBox
            key={index}
            addressNumber={index}
            addressType="shipping"
            country={shippingAddress?.country}
            city={shippingAddress?.city}
            street={shippingAddress?.streetName}
            postalCode={shippingAddress?.postalCode}
            defaultId={defaultShippingId}
            addressId={shippingAddress?.id}
          ></AddressBox>
        ))
      )}

      <Button className={isLoading ? 'disabled edit' : 'edit'}>Edit shipping addresses</Button>
      <br />
      <Button className={isLoading ? 'disabled edit' : 'edit'}>Change password</Button>
    </div>
  );
};

export default Profile;
