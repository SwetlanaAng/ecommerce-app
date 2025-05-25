import React from 'react';
import { Link } from 'react-router-dom';
import { AppRouterPaths } from '../../routes/AppRouterPathsEnums';
import Button from '../../components/button/Button';
import './Register.css';
import { useRegistrationForm } from '../../features/auth/hooks/useRegistrationForm';
import { useRegistrationSubmit } from '../../features/auth/hooks/useRegistrationSubmit';
import PersonalInfoForm from '../../components/registration/PersonalInfoForm';
import AddressSection from '../../components/registration/AddressSection';

const Register: React.FC = () => {
  const {
    formData,
    addressData,
    sameAsShipping,
    isLoading,
    errors,
    isSubmitting,
    register,
    handleSubmit,
    handleChange,
    handleAddressChange,
    handleSameAddressChange,
    handleDefaultAddressChange,
    setIsLoading,
  } = useRegistrationForm();

  const submitData = useRegistrationSubmit({
    formData,
    addressData,
    setIsLoading,
  });

  return (
    <div className="auth-page">
      <h1>Registration</h1>
      <form onSubmit={handleSubmit(submitData)} className="auth-form">
        <div className="form-container">
          <PersonalInfoForm
            formData={formData}
            isDisabled={isLoading}
            onChange={handleChange}
            register={register}
            errors={errors}
          />
          <AddressSection
            addressData={addressData}
            sameAsShipping={sameAsShipping}
            isDisabled={isLoading}
            onAddressChange={handleAddressChange}
            onDefaultAddressChange={handleDefaultAddressChange}
            onSameAddressChange={handleSameAddressChange}
            register={register}
            errors={errors}
          />
        </div>
        <div className="links-container">
          <Button className="submit-button" disabled={isLoading || isSubmitting} type="submit">
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
          <div className="auth-links">
            Do you already have an account? <Link to={AppRouterPaths.LOGIN}>Log in</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
