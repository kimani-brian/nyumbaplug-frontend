import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ReportModal } from './ReportModal';
import * as apiModule from '../../services/api';

vi.mock('../../services/api');

describe('ReportModal', () => {
  const base = {
    isOpen: true,
    onClose: vi.fn(),
    propertyId: 'p1',
    propertyName: 'Test Property',
  };

  it('renders the form and submits a report', async () => {
    (apiModule.api.createReport as any) = vi.fn().mockResolvedValue({});
    render(<ReportModal {...base} />);

    expect(screen.getByRole('heading', { name: /report property or scam/i })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Your Scam Message/i), {
      target: { value: 'Manager asked for deposit before viewing' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit scam report/i }));

    await waitFor(() => expect(apiModule.api.createReport).toHaveBeenCalledWith('p1', 'Asked for deposit before viewing', 'Manager asked for deposit before viewing'));
    expect(await screen.findByRole('status')).toHaveTextContent(/Report submitted/i);
  });

  it('shows a validation alert when the message is empty', async () => {
    (apiModule.api.createReport as any) = vi.fn().mockResolvedValue({});
    render(<ReportModal {...base} />);

    fireEvent.click(screen.getByRole('button', { name: /submit scam report/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/short message/i);
  });
});
