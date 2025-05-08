import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppRouterPaths } from '../../routes/AppRouterPathsEnums';
import { handleRegistration } from '../../services/handleRegistration';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { RegistrationData } from '../../types/interfaces';
import { countryId } from '../../services/registration.service';
import './Register.css';
import { zodResolver } from '@hookform/resolvers/zod';
import Select from '../../components/select/Select';
import { SubmitHandler, useForm } from 'react-hook-form';
import { formSchema, FormFields } from '../../components/input/signInSchema';

interface Address {
  country: string;
  city: string;
  street: string;
  postalCode: string;
  isDefault: boolean;
}

interface AddressData {
  billingAddress: Address;
  shippingAddress: Address;
}

const initialAddress: Address = {
  country: 'Spain',
  city: '',
  street: '',
  postalCode: '',
  isDefault: false,
};

const Register: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  });
  const [addressData, setAddressData] = useState<AddressData>({
    billingAddress: { ...initialAddress },
    shippingAddress: { ...initialAddress },
  });
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
      setValue(name as keyof FormFields, value, { shouldValidate: true });
    },
    [setValue]
  );

  const handleAddressChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        setValue(name as keyof FormFields, value, { shouldValidate: true });
      }
    },
    [sameAsShipping, setValue]
  );

  const handleSameAddressChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setSameAsShipping(checked);

      if (checked) {
        const billingAddress = addressData.billingAddress;
        setAddressData(prev => ({
          ...prev,
          shippingAddress: {
            ...billingAddress,
          },
        }));

        setValue('shipping_city', billingAddress.city, { shouldValidate: true });
        setValue('shipping_street', billingAddress.street, { shouldValidate: true });
        setValue('shipping_postalCode', billingAddress.postalCode, { shouldValidate: true });
        setValue('shipping_isDefault', billingAddress.isDefault, { shouldValidate: true });
      }
      setValue('sameAsShipping', checked, { shouldValidate: true });
    },
    [addressData.billingAddress, setValue]
  );

  const handleDefaultAddressChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setValue(name as keyof FormFields, e.target.checked, { shouldValidate: true });
    },
    [sameAsShipping, setValue]
  );

  const submitData: SubmitHandler<FormFields> = async () => {
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

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (errors: any) => {
    console.log('Form validation errors:', errors);
  };

  const renderAddressFields = (type: 'billing' | 'shipping', isDisabled: boolean) => (
    <>
      <Select
        labelText="Country"
        className="select"
        onChange={handleAddressChange}
        name={`${type}_country`}
        value={addressData[`${type}Address`].country}
        required={true}
        disabled={isDisabled}
        optionsList={countryId}
        autoComplete="country"
      />

      <Input
        labelText="City"
        name={`${type}_city`}
        id={`${type}_city`}
        onChange={handleAddressChange}
        placeholder="Madrid"
        value={addressData[`${type}Address`].city}
        disabled={isDisabled}
        register={register}
        error={errors[`${type}_city`]}
        autoComplete="address-level2"
      />

      <Input
        labelText="Street"
        name={`${type}_street`}
        id={`${type}_street`}
        onChange={handleAddressChange}
        placeholder="Calle de la Princesa"
        value={addressData[`${type}Address`].street}
        disabled={isDisabled}
        register={register}
        error={errors[`${type}_street`]}
        autoComplete="street-address"
      />

      <Input
        labelText="Postal Code"
        name={`${type}_postalCode`}
        id={`${type}_postalCode`}
        onChange={handleAddressChange}
        placeholder="28001"
        value={addressData[`${type}Address`].postalCode}
        disabled={isDisabled}
        register={register}
        error={errors[`${type}_postalCode`]}
        autoComplete="postal-code"
      />

      <Input
        labelText={`Set as default ${type} address for future orders`}
        type="checkbox"
        id={`default_${type}`}
        name={`${type}_isDefault`}
        checked={addressData[`${type}Address`].isDefault}
        onChange={handleDefaultAddressChange}
        disabled={isDisabled}
        register={register}
        error={errors[`${type}_isDefault`]}
      />
    </>
  );

  return (
    <div className="auth-page">
      <h1>Registration</h1>
      <form onSubmit={handleSubmit(submitData, onError)} className="auth-form">
        {error && <div className="error-message">{error}</div>}

        <Input
          labelText="Email"
          name="email"
          id="email"
          onChange={handleChange}
          type="text"
          placeholder="user@example.com"
          value={formData.email}
          disabled={isLoading}
          register={register}
          error={errors.email}
          autoComplete="email"
        />

        <Input
          labelText="Password"
          name="password"
          id="password"
          onChange={handleChange}
          type="password"
          placeholder="••••••••"
          value={formData.password}
          disabled={isLoading}
          register={register}
          error={errors.password}
          autoComplete="new-password"
        />

        <Input
          labelText="First Name"
          name="firstName"
          id="firstName"
          onChange={handleChange}
          placeholder="John"
          value={formData.firstName}
          disabled={isLoading}
          register={register}
          error={errors.firstName}
          autoComplete="given-name"
        />

        <Input
          labelText="Last Name"
          name="lastName"
          id="lastName"
          onChange={handleChange}
          placeholder="Doe"
          value={formData.lastName}
          disabled={isLoading}
          register={register}
          error={errors.lastName}
          autoComplete="family-name"
        />

        <Input
          labelText="Birth date"
          name="dateOfBirth"
          type="date"
          id="date"
          onChange={handleChange}
          placeholder="dd/mm/yyyy"
          value={formData.dateOfBirth}
          disabled={isLoading}
          autoComplete="bday"
          register={register}
          error={errors.dateOfBirth}
        />

        <h3>Billing Address</h3>
        {renderAddressFields('billing', isLoading)}

        <Input
          labelText="Use same address for shipping"
          type="checkbox"
          name="sameAsShipping"
          id="sameAsShipping"
          checked={sameAsShipping}
          onChange={handleSameAddressChange}
          disabled={isLoading}
          register={register}
          error={errors.sameAsShipping}
        />

        {!sameAsShipping && (
          <>
            <h3>Shipping Address</h3>
            {renderAddressFields('shipping', isLoading || sameAsShipping)}
          </>
        )}

        <Button className="submit-button" disabled={isLoading || isSubmitting} type="submit">
          {isLoading ? 'Registering...' : 'Register'}
        </Button>
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
