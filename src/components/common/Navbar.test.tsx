import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './Navbar';
import { AuthProvider } from '../../context/AuthContext';

test('renders brand text', () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    </AuthProvider>
  );
  expect(screen.getByText(/nyumba/i)).toBeInTheDocument();
});
