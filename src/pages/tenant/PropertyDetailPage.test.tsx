import { render, screen } from '@testing-library/react';
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

  it('renders property title and units', async () => {
    render(
      <MemoryRouter initialEntries={["/properties/p1"]}>
        <Routes>
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    const titles = await screen.findAllByText(/Lovely Home/i);
    expect(titles.length).toBeGreaterThan(0);
    const matches = screen.getAllByText(/2 units available/i);
    expect(matches.length).toBeGreaterThan(0);
  });
});
