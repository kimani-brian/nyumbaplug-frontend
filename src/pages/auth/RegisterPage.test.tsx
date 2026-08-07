import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { RegisterPage } from './RegisterPage';
import { AuthProvider } from '../../context/AuthContext';
import * as apiModule from '../../services/api';

vi.mock('../../services/api');

describe('RegisterPage', () => {
  beforeEach(() => {
    (apiModule.api.register as any) = vi.fn().mockResolvedValue({ email: 'new@user.com', message: 'ok' });
  });

  it('submits registration for customer role and calls api.register', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </AuthProvider>
    );

    const nameInput = screen.getByPlaceholderText(/Jane Doe/i);
    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/At least 6 characters/i);
    const submit = screen.getByRole('button', { name: /create account & verify/i });

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(emailInput, { target: { value: 'new@user.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    fireEvent.click(submit);

    await waitFor(() => expect(apiModule.api.register).toHaveBeenCalled());
  });
});
