import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Images } from 'lucide-react';
import { UnitCategory } from '../../types';
import { optimizeImageUrl, resolveMediaUrl } from '../../utils/image';

type MediaItem = { type: 'photo'; url: string } | { type: 'video'; url: string };

interface Props {
  category: UnitCategory | null;
  onClose: () => void;
}

// Returns an embeddable player URL for YouTube/Vimeo links; '' when the URL
// is a plain video file that a <video> tag can play.
const embedUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace('www.', '');
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname === '/watch') return `https://www.youtube.com/embed/${parsed.searchParams.get('v')}`;
      const shorts = parsed.pathname.match(/^\/shorts\/([\w-]+)/);
      if (shorts) return `https://www.youtube.com/embed/${shorts[1]}`;
    }
    if (host === 'youtu.be') {
      return `https://www.youtube.com/embed${parsed.pathname}`;
    }
    if (host === 'vimeo.com') {
      return `https://player.vimeo.com/video${parsed.pathname}`;
    }
  } catch {
    // not a valid absolute URL — treat as direct file
  }
  return '';
};

export const MediaGalleryModal: React.FC<Props> = ({ category, onClose }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [category?.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndex(i => Math.min(i + 1, items.length - 1));
      if (e.key === 'ArrowLeft') setIndex(i => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category?.id, onClose]);

  if (!category) return null;

  const items: MediaItem[] = [
    ...(category.photos || []).map(url => ({ type: 'photo' as const, url })),
    ...(category.video_url ? [{ type: 'video' as const, url: category.video_url }] : []),
  ];

  if (items.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-nyumba-ink/60 backdrop-blur-sm p-4" onClick={onClose}>
        <div className="bg-panel rounded-3xl max-w-sm w-full p-8 relative shadow-lift border border-line animate-scale-in text-center" onClick={e => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-4 right-4 text-fg/40 hover:text-fg/80 p-1.5 rounded-full hover:bg-slate-100 transition">
            <X size={20} />
          </button>
          <Images size={32} className="mx-auto text-fg/30 mb-3" />
          <p className="text-sm font-semibold text-fg">No pics or videos yet</p>
          <p className="text-xs text-fg/50 mt-1">The manager hasn't added media for this unit.</p>
        </div>
      </div>
    );
  }

  const current = items[Math.min(index, items.length - 1)];
  const step = (delta: number) => setIndex(i => (i + delta + items.length) % items.length);
  const embed = current.type === 'video' ? embedUrl(current.url) : '';
  const currentSrc = resolveMediaUrl(current.url) ?? current.url;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-nyumba-ink/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-panel rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 relative shadow-lift border border-line animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-fg/40 hover:text-fg/80 p-1.5 rounded-full hover:bg-slate-100 transition">
          <X size={20} />
        </button>

        <h3 className="display font-bold text-lg text-fg pr-10">
          {category.name}
          <span className="text-sm font-medium text-fg/40 ml-2">· Pics &amp; Videos</span>
        </h3>

        {/* Main viewer */}
        <div className="relative mt-4 bg-page rounded-2xl border border-line overflow-hidden flex items-center justify-center min-h-[240px]">
          {current.type === 'photo' ? (
            <img
              src={optimizeImageUrl(currentSrc, 1200) || currentSrc}
              alt={`${category.name} photo ${index + 1}`}
              className="max-h-[60vh] w-auto max-w-full object-contain"
            />
          ) : embed ? (
            <iframe
              src={embed}
              title={`${category.name} video tour`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full aspect-video"
            />
          ) : (
            <video src={currentSrc} controls autoPlay playsInline className="max-h-[60vh] w-full" />
          )}

          {items.length > 1 && (
            <>
              <button
                onClick={() => step(-1)}
                aria-label="Previous"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-fg rounded-full p-2 shadow-soft transition"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => step(1)}
                aria-label="Next"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-fg rounded-full p-2 shadow-soft transition"
              >
                <ChevronRight size={18} />
              </button>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-nyumba-ink/70 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                {Math.min(index, items.length - 1) + 1} / {items.length}
              </span>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {items.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {items.map((item, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${i === index ? 'border-primary' : 'border-line opacity-70 hover:opacity-100'}`}
              >
                {item.type === 'photo' ? (
                  <img src={optimizeImageUrl(resolveMediaUrl(item.url) || item.url, 200) || item.url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="w-full h-full flex items-center justify-center bg-nyumba-ink text-white">
                    <Play size={18} className="fill-white" />
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};