import '@testing-library/jest-dom';

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation((message, ...args) => {
    if (
      typeof message === 'string' &&
      (message.includes('React Router Future Flag Warning') ||
        message.includes('Relative route resolution within Splat routes is changing'))
    ) {
      return;
    }

    console.warn(message, ...args);
  });
});

afterAll(() => {
  (console.warn as jest.Mock).mockRestore();
});
