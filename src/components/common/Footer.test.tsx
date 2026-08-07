import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Footer } from './Footer';

test('renders footer with brand and copyright', () => {
  render(
    <BrowserRouter>
      <Footer />
    </BrowserRouter>
  );

  expect(screen.getByText(/NyumbaPlug/i)).toBeInTheDocument();
  expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
});
