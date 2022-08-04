import { useState, useEffect, useCallback } from "react";

export default function useLongPress(
  callback = () => {},
  ms = 300,
  { captureEvent }
) {
  const [startLongPress, setStartLongPress] = useState(false);
  const [event, setEvent] = useState();

  useEffect(() => {
    let timerId;
    if (startLongPress) {
      timerId = setTimeout(captureEvent ? callback.bind(event) : callback, ms);
    } else {
      clearTimeout(timerId);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [callback, ms, startLongPress]);

  const start = useCallback((e) => {
    if (captureEvent) setEvent(e);
    setStartLongPress(true);
  }, []);

  const stop = useCallback((e) => {
    setStartLongPress(false);
  }, []);

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseLeave: stop,
    onMouseUp: stop,
    onTouchEnd: stop,
  };
}
