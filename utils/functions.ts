import { days, months } from "@/lib/constants";

export type Time = {
  hours: number,
  minutes: number,
};

type Interval = {
  startTime: number,
  duration: number
};

export const getSubjectAttendanceInfo = (data: { total: number, present: number, off: number }, criteria: number) => {
  const ratio = data.total === 0 ? 100 : data.present / data.total * 100;

  const edge = ratio >= criteria
    ? Math.floor((data.present-criteria/100*data.total)/(criteria/100))
    : Math.ceil((criteria/100*data.total - data.present)/(1-criteria/100));

  const text = ratio === criteria || edge === 0
    ? "Can NOT miss the next lecture"
    : ratio > criteria
    ? `Can miss the next ${edge} classes`
    : `Can NOT miss the next ${edge} classes`;

  return {
    ratio,
    text,
    color: ratio >= criteria ? "mediumseagreen" : "salmon",
    criteria: criteria
  };
}

export const checkIntervals = (cells: Interval[], x: Interval) => {
  if (cells.length === 0) return true;

  let i=0;
  while (i < cells.length && cells[i].startTime < x.startTime) i++;
  
  if (i !== 0 && x.startTime < cells[i-1].startTime + cells[i-1].duration) return false;
  if (i !== cells.length && x.startTime + x.duration > cells[i].startTime) return false;

  return true;
}

export const epochStartTimeToStartTime = (t: number) => {
  const d = new Date(t * 60 * 1000);
  return t - d.setUTCHours(0,0,0,0)/1000/60;
}

export const startTimeToEpochStartTime = (t: number, dayTimestamp: number) => {
  return t + new Date(dayTimestamp).setUTCHours(0,0,0,0)/1000/60;
};

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