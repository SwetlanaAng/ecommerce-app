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
    /* error, */
    isLoading,
    errors,
    isSubmitting,
    register,
    handleSubmit,
    handleChange,
    handleAddressChange,
    handleSameAddressChange,
    handleDefaultAddressChange,
    setError,
    setIsLoading,
  } = useRegistrationForm();

  const submitData = useRegistrationSubmit({
    formData,
    addressData,
    setError,
    setIsLoading,
  });

  return (
    <div className="auth-page">
      <h1>Registration</h1>
      <form onSubmit={handleSubmit(submitData)} className="auth-form">
        {/* {error && <div className="error-message">{error}</div>} */}

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

        <Button className="submit-button" disabled={isLoading || isSubmitting} type="submit">
          {isLoading ? 'Registering...' : 'Register'}
        </Button>
      </form>

      <div className="auth-links">
        Do you already have an account? <Link to={AppRouterPaths.LOGIN}>Log in</Link>
      </div>
    </div>
  );
};

export default Register;
