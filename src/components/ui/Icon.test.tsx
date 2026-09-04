import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Icon } from './Icon';

describe('Icon (Material Symbols)', () => {
  it('renders the requested ligature with the Material Symbols class', () => {
    const { container } = render(<Icon name="search" size={18} className="text-primary" />);
    const span = container.querySelector('.material-symbols-outlined');
    expect(span).toBeTruthy();
    expect(span?.textContent).toBe('search');
    expect(span?.getAttribute('aria-hidden')).toBe('true');
    expect(span?.className).toContain('text-primary');
  });

  it('maps the size prop to font-size', () => {
    const { container } = render(<Icon name="home" size={24} />);
    const span = container.querySelector('.material-symbols-outlined') as HTMLElement;
    expect(span.style.fontSize).toBe('24px');
  });

  it('renders the filled variant via the Material FILL axis', () => {
    const { container } = render(<Icon name="verified" filled />);
    const span = container.querySelector('.material-symbols-outlined') as HTMLElement;
    expect(span.style.fontVariationSettings).toContain("'FILL' 1");
  });

  it('defaults the FILL axis to 0 for outlined icons', () => {
    const { container } = render(<Icon name="refresh" />);
    const span = container.querySelector('.material-symbols-outlined') as HTMLElement;
    expect(span.style.fontVariationSettings).toContain("'FILL' 0");
  });
});