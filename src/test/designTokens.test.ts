import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

/**
 * Phase 1 snapshot — the design foundation (Google style).
 * If a token changes intentionally, update this test to match.
 */
describe('Phase 1 — design foundation tokens', () => {
  const tailwind = read('tailwind.config.js');
  const indexHtml = read('index.html');
  const css = read('src/index.css');

  it('uses Roboto from Google Fonts as the app font', () => {
    expect(tailwind).toContain("'Roboto'");
    expect(indexHtml).toContain('family=Roboto');
  });

  it('loads Google Material Symbols', () => {
    expect(indexHtml).toContain('Material+Symbols+Outlined');
  });

  it('defines the Google Blue primary palette', () => {
    expect(tailwind).toContain('#1A73E8');
    expect(tailwind).toContain('#1967D2');
    expect(tailwind).toContain('#174EA6');
  });

  it('defines Google light and dark surface tokens', () => {
    expect(css).toContain('--page: 248 249 250'); // #F8F9FA light
    expect(css).toContain('--fg: 32 33 36'); // #202124 text
    expect(css).toContain('.dark');
    expect(css).toContain('--page: 32 33 36'); // #202124 dark
    expect(css).toContain('--fg: 232 234 237'); // #E8EAED light text
  });

  it('uses Google-style material elevation + radii', () => {
    expect(tailwind).toContain('rgba(60,64,67,.3)'); // neutral elevation
    expect(tailwind).toContain("rgba(26,115,232,.3)"); // blue CTA glow
    expect(tailwind).toContain("xl: '0.75rem'"); // 12px
    expect(tailwind).toContain("'2xl': '1rem'"); // 16px
  });

  it('exposes light/dark theme-color meta values', () => {
    expect(css).toContain('--panel: 255 255 255'); // light surface
    expect(css).toContain('--panel: 41 42 45'); // dark surface
  });
});