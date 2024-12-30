import { days, months } from "@/lib/constants";

export type Time = {
  hours: number,
  minutes: number,
};

export const epochStartTimeToStartTime = (t: number) => {
  const d = new Date(t * 60 * 1000);
  
  return t - d.setHours(0,0,0,0)/1000/60;
}

export const displayTimeSinceEpoch = (t: number) => {
  return displayTime(epochStartTimeToStartTime(t));
};

export const displayTime = (t: number) => {
  const hours = Math.floor(t/60);
  const minutes = t % 60;
  const ap = hours ? 'am' : 'pm';

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ap}`;
};

export const displayDate = (d: number) => {
  const date = new Date(d);

  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const toTime = (minutes: number): Time => ({
  hours: Math.floor(minutes / 60),
  minutes: minutes % 60
});