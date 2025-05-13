import { useEffect, useState } from 'react';
import { getCustomer } from '../../services/profile.service';
import { CustomerInfo } from '../../types/interfaces';
import './Profile.css';
import { LoginResponse } from '../../services/handleLogin';
import { InfoBox } from '../../components/profile-info-box/InfoBox';

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
  const [defaultBillingId, setDefaultBilling] = useState('');
  const [defaultShippingId, setDefaultShipping] = useState('');

  useEffect(() => {
    const getInfo = async () => {
      const data = await getCustomer();
      setCustomer(data);
      console.log(data);
      const loginInfo: LoginResponse = JSON.parse(
        localStorage.getItem('login') || '{}'
      ) as LoginResponse;
      if (
        loginInfo.defaultBillingAddressId &&
        typeof loginInfo.defaultBillingAddressId === 'string'
      ) {
        setDefaultBilling(loginInfo.defaultBillingAddressId);
      }
      if (
        loginInfo.defaultShippingAddressId &&
        typeof loginInfo.defaultShippingAddressId === 'string'
      ) {
        setDefaultShipping(loginInfo.defaultShippingAddressId);
      }
    };
    getInfo();
  }, []);

  const billingAddress = customer.addresses.find(
    address => address.id === customer.billingAddressIds[0]
  );
  const shippingAddress = customer.addresses.find(
    address => address.id === customer.shippingAddressIds[0]
  );
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

      <h3>Billing Address</h3>

      <InfoBox
        className="billing-country"
        spanText="Country: "
        infoText={billingAddress?.country}
      ></InfoBox>

      <InfoBox className="billing-city" spanText="City: " infoText={billingAddress?.city}></InfoBox>

      <InfoBox
        className="billing-street"
        spanText="Street : "
        infoText={billingAddress?.streetName}
      ></InfoBox>

      <InfoBox
        className="billing-postal-code"
        spanText="Postal code: "
        infoText={billingAddress?.postalCode}
      ></InfoBox>

      {defaultBillingId === billingAddress?.id && (
        <div className="default">This address is set as default billing address </div>
      )}

      <h3>Shipping Address</h3>

      <InfoBox
        className="shipping-country"
        spanText="Country: "
        infoText={shippingAddress?.country}
      ></InfoBox>

      <InfoBox
        className="shipping-city"
        spanText="City: "
        infoText={shippingAddress?.city}
      ></InfoBox>

      <InfoBox
        className="shipping-street"
        spanText="Street : "
        infoText={shippingAddress?.streetName}
      ></InfoBox>

      <InfoBox
        className="shipping-postal-code"
        spanText="Postal code: "
        infoText={shippingAddress?.postalCode}
      ></InfoBox>

      {defaultShippingId === shippingAddress?.id && (
        <div className="default">This address is set as default shipping address </div>
      )}
    </div>
  );
};

export default Profile;
