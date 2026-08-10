import React, { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';

type Direction = 'up' | 'down' | 'left' | 'right' | 'zoom' | 'fade';

interface RevealProps {
  direction?: Direction;
  delay?: number;
  className?: string;
  children: React.ReactNode;
  threshold?: number;
}

const hiddenByDirection: Record<Direction, string> = {
  up: 'opacity-0 translate-y-8',
  down: 'opacity-0 -translate-y-8',
  left: 'opacity-0 translate-x-10',
  right: 'opacity-0 -translate-x-10',
  zoom: 'opacity-0 scale-95',
  fade: 'opacity-0',
};

const visibleClass: Record<Direction, string> = {
  up: 'opacity-100 translate-y-0',
  down: 'opacity-100 translate-y-0',
  left: 'opacity-100 translate-x-0',
  right: 'opacity-100 translate-x-0',
  zoom: 'opacity-100 scale-100',
  fade: 'opacity-100',
};

export const Reveal: React.FC<RevealProps> = ({
  direction = 'up',
  delay = 0,
  className,
  children,
  threshold = 0.15,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => setVisible(true);

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            reveal();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);

    const onScroll = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        reveal();
        observer.unobserve(el);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={clsx(
        'transition-all duration-700 ease-out will-change-transform',
        visible ? visibleClass[direction] : hiddenByDirection[direction],
        className
      )}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
};
