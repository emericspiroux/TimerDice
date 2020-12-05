import { useEffect, useState } from 'react';

export default function useSinceClock(startDate: Date | undefined): number {
  const [now, setNow] = useState<Date>(() => new Date());

  function tick() {
    setNow(new Date());
  }

  useEffect(() => {
    if (!startDate) return () => {};
    const timerID = setInterval(() => tick(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  }, [startDate]);

  return startDate ? (now.valueOf() - new Date(startDate).valueOf()) / 1000 : 0;
}
