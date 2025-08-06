import { calculateActualElapsedDuration } from '@/lib/utils';
import { useEffect, useState } from 'react';

export const useElapsedTime = (createdAt: Date | string) => {
  const [duration, setDuration] = useState(() =>
    calculateActualElapsedDuration(createdAt)
  );

  useEffect(() => {
    setDuration(calculateActualElapsedDuration(createdAt));

    const interval = setInterval(() => {
      const newDuration = calculateActualElapsedDuration(createdAt);
      console.log('Updating duration:', newDuration);
      setDuration(newDuration);
    }, 60000);

    return () => clearInterval(interval);
  }, [createdAt]);

  return duration;
};
