import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { VerifyEmailPage } from './VerifyEmailPage';
import { AuthProvider } from '../../context/AuthContext';

vi.mock('../../services/api');

describe('VerifyEmailPage', () => {
  beforeEach(() => {
    (vi.mocked as any);
  });

  it('renders the verification form', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <VerifyEmailPage />
        </BrowserRouter>
      </AuthProvider>
    );
    expect(screen.getByRole('heading', { name: /verify your email/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /verify & continue/i })).toBeInTheDocument();
  });

  it('shows a validation message when the code is not 6 digits', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <VerifyEmailPage />
        </BrowserRouter>
      </AuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /verify & continue/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/6-digit code/i);
  });
});
