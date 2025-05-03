import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppRouterPaths } from '../../routes/AppRouterPathsEnums';
import createCustomer from '../../shared/api/createCustomer';
import Input from '../../components/input/Input';
import './Register.css';
import Button from '../../components/button/Button';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    birthDate: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const customerDraft = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
      };

      await createCustomer(customerDraft);
      navigate(AppRouterPaths.LOGIN);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="error-message">{error}</div>}

        <Input
          labelText="Email"
          name="email"
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
          onChange={handleChange}
          placeholder="John"
          value={formData.firstName}
          required={true}
          disabled={isLoading}
        ></Input>

        <Input
          labelText="Last Name"
          name="lastName"
          onChange={handleChange}
          placeholder="Doe"
          value={formData.lastName}
          required={true}
          disabled={isLoading}
        ></Input>

        <Input
          labelText="Birth date"
          name="birthDate"
          type="date"
          onChange={handleChange}
          placeholder="01.01.2000"
          value={formData.birthDate}
          required={true}
          disabled={isLoading}
          autoComplete="off"
        ></Input>
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
