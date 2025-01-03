import { SQLiteDatabase } from "expo-sqlite";
import { Status } from "./records";

export const markingColors : Record<Marking, string> = [
  "salmon",
  "orange",
  "mediumseagreen",
  "blue",
  "hotpink",
  "lightgray"
];

export enum Marking {
  Missed = 0,
  Off = 1,
  Present = 2,
  RequiresMarking = 3,
  Mixed = 4,
  NoData = 5
}

export interface MonthData {
  markings: Marking[];
  count: Record<Marking, number>;
}

export const getMonthData = async (db: SQLiteDatabase, date: Date): Promise<MonthData> => {
  date.setUTCHours(0, 0, 0, 0);

  const markings : Marking[] = new Array(32).fill(Marking.NoData);

  const count : Record<Marking, number> = [0,0,0,0,0,0];

  for (let i = 1; i < 32; i++) {
    date.setUTCDate(i);
    //TODO
    const res = await db.getAllAsync<{ subjectId: number|null, status: Status }>(
      `SELECT subjectId, status FROM records WHERE startTimeMinsSinceEpoch >= ? AND startTimeMinsSinceEpoch < ?`,
      [date.getTime() / 1000 / 60, date.getTime() / 1000 / 60 + 1440]
    );

    if (res.length === 0) {
      markings[i] = Marking.NoData;
      count[Marking.NoData]++;
      continue;
    }

    const f = [0,0,0,0];

    for (let r of res) {
      if (r.subjectId === null) continue;
      
      f[ (r.status ?? 2) + 1]++;
    }

    if (f[Marking.RequiresMarking] > 0) {
      markings[i] = Marking.RequiresMarking;
      count[Marking.RequiresMarking]++;
    } else if (f[Marking.Present] > 0) {
      if (f[Marking.Missed] > 0) {
        markings[i] = Marking.Mixed;
        count[Marking.Mixed]++;
      } else {
        markings[i] = Marking.Present;
        count[Marking.Present]++;
      }
    } else if (f[Marking.Missed] > 0) {
      markings[i] = Marking.Missed;
      count[Marking.Missed]++;
    } else if (f[Marking.Off] > 0) {
      markings[i] = Marking.Off;
      count[Marking.Off]++;
    }
  }

  return {
    count,
    markings
  };
};
