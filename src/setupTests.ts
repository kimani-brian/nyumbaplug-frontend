import '@testing-library/jest-dom';

// jsdom does not implement IntersectionObserver (used by the Reveal component).
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
if (typeof globalThis.IntersectionObserver === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).IntersectionObserver = MockIntersectionObserver;
}

// jsdom does not implement window.matchMedia (used by ThemeContext).
if (!window.matchMedia) {
  const matchMediaMock = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
  window.matchMedia = matchMediaMock;
}

// Keep test runs deterministic: default to light theme unless a test opts in.
if (window.localStorage) {
  window.localStorage.setItem('nyumbaplug-theme', 'light');
}
