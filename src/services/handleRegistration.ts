import { RegistrationData, ResultProps } from '../types/interfaces';
import { dataAdapter, createCustomer } from './registration.service';
import handleLogin from './handleLogin';

export async function handleRegistration(data: RegistrationData): Promise<ResultProps> {
  if (!data) {
    return {
      isSuccess: false,
      message: 'No registration data provided',
    };
  }

  try {
    const dataAdapted = dataAdapter(data);

    const result = await createCustomer(dataAdapted);

    if (result.isSuccess) {
      try {
        await handleLogin(data.email, data.password);
      } catch (loginError) {
        console.error('Auto-login after registration failed:', loginError);
      }
    }

    return result;
  } catch (error) {
    console.error('Registration process error:', error);
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : 'Registration failed',
    };
  }
}
