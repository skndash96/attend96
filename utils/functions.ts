export type Time = {
  hours: number,
  minutes: number,
};

export const displayTime = (t: number) => {
  const hours = Math.floor(t/60);
  const minutes = t % 60;
  const ap = hours ? 'am' : 'pm';

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ap}`;
};

export const toTime = (minutes: number): Time => ({
  hours: Math.floor(minutes / 60),
  minutes: minutes % 60
});