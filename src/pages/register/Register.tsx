import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppRouterPaths } from '../../routes/AppRouterPathsEnums';
import { handleRegistration } from '../../services/handleRegistration';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { RegistrationData } from '../../types/interfaces';
import { countryId } from '../../services/registration.service';
import './Register.css';
import Select from '../../components/select/Select';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  });
  const [addressData, setAddressData] = useState({
    billingAddress: {
      country: 'Spain',
      city: '',
      street: '',
      postalCode: '',
      isDefault: false,
    },
    shippingAddress: {
      country: 'Spain',
      city: '',
      street: '',
      postalCode: '',
      isDefault: false,
    },
  });
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    const [addressType, fieldName] = name.split('_');

    if (addressType === 'billing' || addressType === 'shipping') {
      setAddressData(prev => {
        const newData = {
          ...prev,
          [`${addressType}Address`]: {
            ...prev[`${addressType}Address` as keyof typeof prev],
            [fieldName]: value,
          },
        };

        if (sameAsShipping && addressType === 'billing') {
          newData.shippingAddress = {
            ...newData.shippingAddress,
            [fieldName]: value,
          };
        }

        return newData;
      });
    }
  };

  const handleSameAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSameAsShipping(checked);

    if (checked) {
      setAddressData(prev => ({
        ...prev,
        shippingAddress: {
          ...prev.billingAddress,
        },
      }));
    }
  };

  const handleDefaultAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const [addressType] = name.split('_');

    setAddressData(prev => {
      const newData = {
        ...prev,
        [`${addressType}Address`]: {
          ...prev[`${addressType}Address` as keyof typeof prev],
          isDefault: e.target.checked,
        },
      };

      if (sameAsShipping && addressType === 'billing') {
        newData.shippingAddress = {
          ...newData.shippingAddress,
          isDefault: e.target.checked,
        };
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const registrationData: RegistrationData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        secondName: formData.lastName,
        date: formData.dateOfBirth,
        billingAddress: addressData.billingAddress,
        shippingAddress: addressData.shippingAddress,
      };

      const result = await handleRegistration(registrationData);

      if (result.isSuccess) {
        login({
          id: result.message,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
        navigate(AppRouterPaths.HOME);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h1>Registration</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="error-message">{error}</div>}

        <Input
          labelText="Email"
          name="email"
          id="email"
          onChange={handleChange}
          type="email"
          placeholder="user@example.com"
          value={formData.email}
          required={true}
          disabled={isLoading}
        ></Input>

        <Input
          labelText="Password"
          name="password"
          id="password"
          onChange={handleChange}
          type="password"
          placeholder="*************"
          value={formData.password}
          required={true}
          disabled={isLoading}
          minLength={8}
        ></Input>

        <Input
          labelText="First Name"
          name="firstName"
          id="firstName"
          onChange={handleChange}
          placeholder="John"
          value={formData.firstName}
          required={true}
          disabled={isLoading}
        ></Input>

        <Input
          labelText="Last Name"
          name="lastName"
          id="lastName"
          onChange={handleChange}
          placeholder="Doe"
          value={formData.lastName}
          required={true}
          disabled={isLoading}
        ></Input>

        <Input
          labelText="Birth date"
          name="dateOfBirth"
          type="date"
          id="date"
          onChange={handleChange}
          placeholder="dd/mm/yyyy"
          value={formData.dateOfBirth}
          required={true}
          disabled={isLoading}
          autoComplete="off"
        ></Input>

        <h3>Billing Address</h3>

        <Select
          labelText="Country"
          className="select"
          onChange={handleAddressChange}
          name="billing_country"
          value={addressData.billingAddress.country}
          required={true}
          disabled={isLoading}
          optionsList={countryId}
        />

        <Input
          labelText="City"
          name="billing_city"
          id="billing_city"
          onChange={handleAddressChange}
          placeholder="Madrid"
          value={addressData.billingAddress.city}
          required={true}
          disabled={isLoading}
        ></Input>

        <Input
          labelText="Street"
          name="billing_street"
          id="billing_street"
          onChange={handleAddressChange}
          placeholder="Calle de la Princesa"
          value={addressData.billingAddress.street}
          required={true}
          disabled={isLoading}
        ></Input>

        <Input
          labelText="Postal Code"
          name="billing_postalCode"
          id="billing_postalCode"
          onChange={handleAddressChange}
          placeholder="28001"
          value={addressData.billingAddress.postalCode}
          required={true}
          disabled={isLoading}
        ></Input>

        <Input
          labelText="Set as default billing address for future orders"
          type="checkbox"
          id="default_billing"
          name="billing_isDefault"
          checked={addressData.billingAddress.isDefault}
          onChange={handleDefaultAddressChange}
          disabled={isLoading}
        />

        <Input
          labelText="Use same address for shipping"
          type="checkbox"
          name="sameAsShipping"
          id="sameAsShipping"
          checked={sameAsShipping}
          onChange={handleSameAddressChange}
          disabled={isLoading}
        />

        {!sameAsShipping && (
          <>
            <h3>Shipping Address</h3>
            <Select
              labelText="Country"
              className="select"
              onChange={handleAddressChange}
              name="shipping_country"
              value={addressData.shippingAddress.country}
              required={true}
              disabled={isLoading || sameAsShipping}
              optionsList={countryId}
            />

            <Input
              labelText="City"
              name="shipping_city"
              id="shipping_city"
              onChange={handleAddressChange}
              placeholder="Madrid"
              value={addressData.shippingAddress.city}
              required={true}
              disabled={isLoading || sameAsShipping}
            ></Input>

            <Input
              labelText="Street"
              name="shipping_street"
              id="shipping_street"
              onChange={handleAddressChange}
              placeholder="Calle de la Princesa"
              value={addressData.shippingAddress.street}
              required={true}
              disabled={isLoading || sameAsShipping}
            ></Input>

            <Input
              labelText="Postal Code"
              name="shipping_postalCode"
              id="shipping_postalCode"
              onChange={handleAddressChange}
              placeholder="28001"
              value={addressData.shippingAddress.postalCode}
              required={true}
              disabled={isLoading || sameAsShipping}
            ></Input>

            <Input
              labelText="Set as default shipping address for future orders"
              type="checkbox"
              id="default_shipping"
              name="shipping_isDefault"
              checked={addressData.shippingAddress.isDefault}
              onChange={handleDefaultAddressChange}
              disabled={isLoading || sameAsShipping}
            />
          </>
        )}

        <Button
          className="submit-button"
          disabled={isLoading}
          type="submit"
          children={isLoading ? 'Registering...' : 'Register'}
        />
      </form>

      <div className="auth-links">
        <p>
          Do you already have an account? <Link to={AppRouterPaths.LOGIN}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
