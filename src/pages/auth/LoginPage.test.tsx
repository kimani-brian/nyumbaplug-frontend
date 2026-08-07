import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { LoginPage } from './LoginPage';
import { AuthProvider } from '../../context/AuthContext';
import * as apiModule from '../../services/api';

vi.mock('../../services/api');

describe('LoginPage', () => {
  beforeEach(() => {
    (apiModule.api.login as any) = vi.fn().mockResolvedValue({ token: 't1', user: { id: 'u1', role: 'tenant', email: 'a@b.com', created_at: new Date().toISOString() } });
  });

  it('submits login form and calls api.login', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </AuthProvider>
    );

    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/Enter password/i);
    const submit = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'a@b.com' } });
    fireEvent.change(passwordInput, { target: { value: 'secret' } });

    fireEvent.click(submit);

    await waitFor(() => expect(apiModule.api.login).toHaveBeenCalledWith('a@b.com', 'secret'));
  });
});
