import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { BrowsePage } from './BrowsePage';
import * as apiModule from '../../services/api';

vi.mock('../../services/api');

const mockProps = [
  {
    id: 'p1',
    landlord_id: 'l1',
    name: 'Test Property',
    location: 'Westlands',
    county: 'Nairobi',
    description: 'A lovely place',
    image_url: '',
    created_at: new Date().toISOString(),
    categories: [],
    min_rent: 5000,
    total_units: 1,
  },
];

describe('BrowsePage', () => {
  beforeEach(() => {
    (apiModule.api.getProperties as any) = vi.fn().mockResolvedValue(mockProps);
  });

  it('renders results count and a property card', async () => {
    render(
      <BrowserRouter>
        <BrowsePage />
      </BrowserRouter>
    );

    expect(await screen.findByText(/Test Property/i)).toBeInTheDocument();
    expect(screen.getByText(/verified listing/i)).toBeInTheDocument();
  });

  it('applies a price filter chip and refetches with rent bounds', async () => {
    render(
      <BrowserRouter>
        <BrowsePage />
      </BrowserRouter>
    );

    await screen.findByText(/Test Property/i);
    fireEvent.click(screen.getByRole('button', { name: 'KES 4K – 10K' }));

    await new Promise(r => setTimeout(r, 0));
    expect(apiModule.api.getProperties).toHaveBeenCalledWith(
      expect.objectContaining({ min_rent: 4000, max_rent: 10000 })
    );
  });
});
