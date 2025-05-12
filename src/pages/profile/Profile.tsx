import { useEffect, useState } from 'react';
import { getCustomer } from '../../services/profile.service';
import { CustomerInfo } from '../../types/interfaces';
import './Profile.css';

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

  useEffect(() => {
    const getInfo = async () => {
      const data = await getCustomer();
      setCustomer(data);
    };
    getInfo();
  }, []);
  return (
    <div className="profile-page">
      <h1>Profile information</h1>

      <h2>Personal information</h2>

      <div className="info-box first-name">
        <span>First name: </span>
        {customer.firstName}
      </div>
      <div className="info-box last-name">
        <span>Last name: </span>
        {customer.lastName}
      </div>
      <div className="info-box birth-date">
        <span>Date of birth: </span>
        {customer.dateOfBirth}
      </div>

      <h2>Addresses</h2>

      <h3>Billing Address</h3>
      <div className="info-box billing-country">
        <span>Country: </span>Germany
      </div>
      <div className="info-box billing-city">
        <span>City: </span>Munich
      </div>
      <div className="info-box billing-street">
        <span>Street : </span>Welfenstrabe
      </div>
      <div className="info-box billing-postal-code">
        <span>Postal code: </span>11255
      </div>
      <h3>Shipping Address</h3>
      <div className="info-box shipping-country">
        <span>Country: </span>Germany
      </div>
      <div className="info-box shipping-city">
        <span>City: </span>Munich
      </div>
      <div className="info-box shipping-street">
        <span>Street: </span>Welfenstrabe
      </div>
      <div className="info-box shipping-postal-code">
        <span>Postal code: </span>11255
      </div>

      <h2>Default Addresses</h2>

      <h3>Default Billing Address</h3>
      <div className="info-box default-billing-country">
        <span>Country: </span>Germany
      </div>
      <div className="info-box default-billing-city">
        <span>City: </span>Munich
      </div>
      <div className="info-box default-billing-street">
        <span>Street: </span>Welfenstrabe
      </div>
      <div className="info-box default-billing-postal-code">
        <span>Postal code: </span>11255
      </div>
      <h3>Default Shipping Address</h3>
      <div className="info-box default-shipping-country">
        <span>Country: </span>Germany
      </div>
      <div className="info-box default-shipping-city">
        <span>City: </span>Munich
      </div>
      <div className="info-box default-shipping-street">
        <span>Street: </span>Welfenstrabe
      </div>
      <div className="info-box default-shipping-postal-code">
        <span>Postal code: </span>11255
      </div>
    </div>
  );
};

export default Profile;
