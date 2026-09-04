import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeContext';

const Probe = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button type="button" onClick={toggleTheme} aria-label={`toggle theme (${theme})`}>
      {theme}
    </button>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    window.localStorage.setItem('nyumbaplug-theme', 'light');
    document.documentElement.classList.remove('dark');
  });

  it('reads an explicit stored theme', () => {
    window.localStorage.setItem('nyumbaplug-theme', 'dark');
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toHaveTextContent('dark');
  });

  it('toggles light <-> dark and flips the .dark class on <html>', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );

    const btn = screen.getByRole('button');
    expect(btn).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    act(() => btn.click());
    expect(btn).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    act(() => btn.click());
    expect(btn).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('persists the chosen theme to localStorage', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );
    act(() => screen.getByRole('button').click());
    expect(window.localStorage.getItem('nyumbaplug-theme')).toBe('dark');
  });
});