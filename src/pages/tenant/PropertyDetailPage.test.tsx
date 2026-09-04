import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import { PropertyDetailPage } from './PropertyDetailPage';
import * as apiModule from '../../services/api';

vi.mock('../../services/api');

const mockDetail = {
  property: {
    id: 'p1',
    landlord_id: 'l1',
    name: 'Lovely Home',
    location: 'Karen',
    county: 'Nairobi',
    description: 'Nice home',
    image_url: '',
    created_at: new Date().toISOString(),
    map_coords: '1.2921,36.8219'
  },
  categories: [
    { id: 'c1', property_id: 'p1', name: '1BR', rent_amount: 15000, quantity_available: 2, photos: [], created_at: new Date().toISOString() }
  ]
};

describe('PropertyDetailPage', () => {
  beforeEach(() => {
    (apiModule.api.getPropertyDetail as any) = vi.fn().mockResolvedValue(mockDetail);
  });

  it('renders property title without image badges', async () => {
    render(
      <MemoryRouter initialEntries={["/properties/p1"]}>
        <Routes>
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    const titles = await screen.findAllByText(/Lovely Home/i);
    expect(titles.length).toBeGreaterThan(0);
    expect(screen.queryByText(/2 units available/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Verified Property Manager/i)).not.toBeInTheDocument();
  });

  it('renders the sticky contact rail and report button', async () => {
    render(
      <MemoryRouter initialEntries={["/properties/p1"]}>
        <Routes>
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Ready to view\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Verified listing/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /report this property/i })).toBeInTheDocument();
  });

  it('opens the report modal from the side rail', async () => {
    render(
      <MemoryRouter initialEntries={["/properties/p1"]}>
        <Routes>
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByText(/Ready to view\?/i);
    fireEvent.click(screen.getByRole('button', { name: /report this property/i }));

    expect(await screen.findByText(/Report Property or Scam/i)).toBeInTheDocument();
  });
});
