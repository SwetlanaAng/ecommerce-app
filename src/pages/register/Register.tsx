import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppRouterPaths } from '../../routes/AppRouterPathsEnums';
import createCustomer from '../../shared/api/createCustomer';
import Input from '../../components/input/Input';
import './Register.css';

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

        <div className="form-group">
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
        </div>

        <div className="form-group">
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
        </div>

        <div className="form-group">
          <Input
            labelText="First Name"
            name="firstName"
            onChange={handleChange}
            placeholder="John"
            value={formData.firstName}
            required={true}
            disabled={isLoading}
          ></Input>
        </div>

        <div className="form-group">
          <Input
            labelText="Last Name"
            name="lastName"
            onChange={handleChange}
            placeholder="Doe"
            value={formData.lastName}
            required={true}
            disabled={isLoading}
          ></Input>
        </div>

        <div className="form-group">
          <Input
            labelText="Birth date"
            name="BirthDate"
            type="date"
            onChange={handleChange}
            placeholder="01.01.2000"
            value={formData.birthDate}
            required={true}
            disabled={isLoading}
            autoComplete="off"
          ></Input>
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <div className="auth-links">
        <p>
          Уже есть аккаунт? <Link to={AppRouterPaths.LOGIN}>Вход</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
