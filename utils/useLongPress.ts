import { useCallback, useEffect, useRef, useState } from 'react';

type CallbackFunction = () => void;

const useLongPress = (callback: CallbackFunction, delay: number = 500) => {
  const [startLongPress, setStartLongPress] = useState(false);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const start = useCallback(() => {
    setStartLongPress(true);
    const timerId = setTimeout(() => {
      if (startLongPress) {
        callbackRef.current();
      }
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [delay, startLongPress]);

  const stop = useCallback(() => {
    setStartLongPress(false);
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };
};

export default useLongPress;
