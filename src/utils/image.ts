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
