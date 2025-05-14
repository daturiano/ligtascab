import { useEffect, useState } from 'react';

type BreakpointRange = {
  min?: number;
  max?: number;
};

export function useMobile({ min, max }: BreakpointRange) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let mediaQuery = '';

    if (min !== undefined && max !== undefined) {
      mediaQuery = `(min-width: ${min}px) and (max-width: ${max - 0.02}px)`;
    } else if (min !== undefined) {
      mediaQuery = `(min-width: ${min}px)`;
    } else if (max !== undefined) {
      mediaQuery = `(max-width: ${max - 0.02}px)`;
    }

    const media = window.matchMedia(mediaQuery);

    const listener = () => setMatches(media.matches);
    listener(); // set on mount
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [min, max]);

  return matches;
}
