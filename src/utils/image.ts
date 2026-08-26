// Origin of the backend server (e.g. http://localhost:8081). Uploads are
// stored as relative paths (/uploads/...) and must be resolved against it,
// because they are served by the API, not the frontend host.
const API_ORIGIN = (() => {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/v1';
  return base.replace(/\/api\/v1\/?$/, '');
})();

export const resolveMediaUrl = (url?: string | null): string | null => {
  if (!url) return null;
  if (url.startsWith('/')) return `${API_ORIGIN}${url}`;
  return url;
};

export const optimizeImageUrl = (url?: string | null, width = 900): string | null => {
  if (!url) return null;

  if (url.startsWith('http')) {
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes('images.unsplash.com')) {
        parsed.searchParams.set('w', String(width));
        parsed.searchParams.set('q', '80');
        parsed.searchParams.set('auto', 'format');
        parsed.searchParams.set('fit', 'crop');
        return parsed.toString();
      }
    } catch {
      return url;
    }
  }

  return url;
};
