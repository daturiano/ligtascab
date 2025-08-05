import { calculateElapsedDuration } from '@/lib/utils';
import { useEffect, useState } from 'react';

export const useElapsedTime = (createdAt: Date | string) => {
  const [duration, setDuration] = useState(() =>
    calculateElapsedDuration(createdAt)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(calculateElapsedDuration(createdAt));
    }, 60000);

    return () => clearInterval(interval);
  }, [createdAt]);

  return duration;
};
