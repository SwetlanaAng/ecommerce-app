import { act } from '@testing-library/react';

jest.mock('./services/keys', () => ({
  KEYS: {
    API_URL: 'http://test-api-url',
    AUTH_URL: 'http://test-auth-url',
    PROJECT_KEY: 'test-project-key',
    CLIENT_ID: 'test-client-id',
    CLIENT_SECRET: 'test-client-secret',
    SCOPES: ['test-scope'],
  },
}));

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
  })),
}));

describe('Main entry point', () => {
  it('should render App component', async () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    await act(async () => {
      await import('./main.tsx');
    });

    expect(document.getElementById('root')).toBeTruthy();
  });
});
