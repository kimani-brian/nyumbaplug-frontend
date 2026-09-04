import { render, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { Navbar } from './Navbar';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { Footer } from './Footer';

const renderNav = () =>
  render(
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );

describe('Navbar (Material)', () => {
  beforeEach(() => {
    window.localStorage.setItem('nyumbaplug-theme', 'light');
    document.documentElement.classList.remove('dark');
  });

  it('renders brand text', () => {
    renderNav();
    expect(screen.getByText(/nyumba/i)).toBeInTheDocument();
  });

  it('renders the theme toggle and toggles dark mode', () => {
    renderNav();
    const toggles = screen.getAllByRole('button', { name: /switch to dark mode/i });
    expect(toggles.length).toBeGreaterThan(0);
    const toggle = toggles[0];
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    act(() => toggle.click());
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('shows both Sign in and Get started links for logged-out users', () => {
    renderNav();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /get started/i })).toBeInTheDocument();
  });
});

describe('Footer (Material)', () => {
  it('renders footer with brand + copyright in light and dark modes', () => {
    const { rerender } = render(
      <ThemeProvider>
        <BrowserRouter>
          <Footer />
        </BrowserRouter>
      </ThemeProvider>
    );
    expect(screen.getByText(/NyumbaPlug/i)).toBeInTheDocument();
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();

    act(() => {
      document.documentElement.classList.add('dark');
    });
    rerender(
      <ThemeProvider>
        <BrowserRouter>
          <Footer />
        </BrowserRouter>
      </ThemeProvider>
    );
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
  });
});
