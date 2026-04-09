import { useEffect, useState } from 'react';
import TimeEntryHelpers from '@entities/time-entry/utils.ts';

const INITIAL_DURATION = '--:--:--';

function useElapsedTimer(startTime: string | undefined, isActive: boolean): string {
  const [duration, setDuration] = useState(INITIAL_DURATION);

  useEffect(() => {
    if (!isActive) {
      setDuration(INITIAL_DURATION);
      return;
    }

    let frameId: number;

    const tick = () => {
      const now = new Date().toISOString();
      setDuration(TimeEntryHelpers.formatEntryDuration(startTime!, now));
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isActive, startTime]);

  return duration;
}

export default useElapsedTimer;
