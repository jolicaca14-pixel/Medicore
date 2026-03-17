import { useEffect, useRef } from 'react';

/**
 * Hook to automatically log out the user after a period of inactivity.
 * @param timeoutMs Timeout in milliseconds (default: 15 minutes)
 * @param onTimeout Callback function to execute when timeout is reached
 */
export const useSessionTimeout = (timeoutMs: number = 15 * 60 * 1000, onTimeout: () => void) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      onTimeout();
    }, timeoutMs);
  };

  useEffect(() => {
    // Events that indicate user activity
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click'
    ];

    // Initialize timer
    resetTimer();

    // Add event listeners
    const handleActivity = () => resetTimer();

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [timeoutMs, onTimeout]);

  return { resetTimer };
};
