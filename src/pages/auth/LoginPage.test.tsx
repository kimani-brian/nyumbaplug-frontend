import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { LoginPage } from './LoginPage';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import * as apiModule from '../../services/api';

vi.mock('../../services/api');

describe('LoginPage', () => {
  beforeEach(() => {
    window.localStorage.setItem('nyumbaplug-theme', 'light');
    document.documentElement.classList.remove('dark');
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

  it('shows a validation message for an invalid email', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </AuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), { target: { value: 'not-an-email' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/valid email/i);
  });

  it('renders the auth card in dark mode', () => {
    document.documentElement.classList.add('dark');
    render(
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <LoginPage />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    );

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByText(/Find.Verify.Move./i)).toBeInTheDocument();
  });
});
