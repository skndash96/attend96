import { SQLiteDatabase } from "expo-sqlite";
import { FullCell, getTimetableOfDay } from "./timetable";
import { getAllSlots, Slot } from "./slots";

export type Status = -1 | 0 | 1 | null //1 for present, -1 for absent, 0 for didnt occur

export interface AttendanceRecord {
  id: number;
  startTimeMinsSinceEpoch: number; //epoch timestamp in minutes; will exactly match startTime of slot
  durationMins: number; //minutes
  subjectId: number | null; //null for free period
  status: Status | null; //null for not marked
}

export interface FullAttendanceRecord extends AttendanceRecord {
  subjectName?: string;
  subjectShortName?: string;
};

type InsertAttendanceRecord = Omit<AttendanceRecord, 'id'>;

export const getFullRecordsOfToday = async (db: SQLiteDatabase, cells: (FullCell | null)[], slots: Slot[], retry: boolean): Promise<FullAttendanceRecord[]> => {
  return getFullRecordsOfDate(db, Date.now(), cells, slots, retry);
}

export const getFullRecordsOfDate = async (db: SQLiteDatabase, date: number, cells: (FullCell | null)[], slots: Slot[], retry: boolean): Promise<FullAttendanceRecord[]> => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const depoch = d.getTime() / 1000 / 60;

  const res = await db.getAllAsync<FullAttendanceRecord>(
    `SELECT records.*, subjects.name as subjectName, subjects.shortName as subjectShortName FROM records
    LEFT JOIN subjects ON records.subjectId = subjects.id
    WHERE startTimeMinsSinceEpoch >= ?
    AND startTimeMinsSinceEpoch < ?
    ORDER BY startTimeMinsSinceEpoch`,
    [
      depoch,
      depoch + 1440 //1440 means one day
    ]
  );

  if (res.length === 0) {
    if (retry == true) {
      await Promise.all(cells.map((cell, i) => {
        const record = {
          subjectId: cell?.subjectId || null,
          startTimeMinsSinceEpoch: d.getTime() / 1000 / 60 + slots[i].startTime,
          durationMins: slots[i].duration,
          status: null
        };

        return insertRecord(db, record);
      }));

      const res = await getFullRecordsOfDate(db, date, cells, slots, false);
      
      return res;
    }
  }

  return res;
}

export const insertRecord = async (db: SQLiteDatabase, record: InsertAttendanceRecord) => {
  if (record.subjectId === null && record.status !== null) {
    throw new Error("Subject ID cannot be null if status is not null");
  }

  const res = await db.runAsync(
    `INSERT INTO records (startTimeMinsSinceEpoch, durationMins, subjectId, status) VALUES (?, ?, ?, ?)`,
    [record.startTimeMinsSinceEpoch, record.durationMins, record.subjectId, record.status]
  );

  return res.lastInsertRowId;
}

export const updateRecordStatus = async (db: SQLiteDatabase, id: number, to: Status) => {
  await db.runAsync(
    `UPDATE records SET status = ? WHERE id = ?`,
    [to, id]
  );
};
