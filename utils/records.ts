import { SQLiteDatabase } from "expo-sqlite";
import { FullCell } from "./timetable";
import { updateSubjectAttendance } from "./subjects";

export type Status = -1 | 0 | 1 | null //1 for present, -1 for absent, 0 for didnt occur

export interface AttendanceRecord {
  id: number;
  startTimeMinsSinceEpoch: number; //epoch timestamp in minutes; will exactly match startTime of slot
  durationMins: number; //minutes
  subjectId: number | null; //null for free period
  status: Status | null; //null for not marked
  isExtra?: boolean;
}

export interface FullAttendanceRecord extends AttendanceRecord {
  subjectName?: string;
  subjectShortName?: string;
  subjectTotal?: number;
  subjectPresent?: number;
  subjectOff?: number;
};

type InsertAttendanceRecord = Omit<AttendanceRecord, 'id'>;

export const getFullRecordsOfToday = async (db: SQLiteDatabase, cells: FullCell[], retry: boolean): Promise<FullAttendanceRecord[]> => {
  return getFullRecordsOfDate(db, Date.now(), cells, retry);
}

export const getFullRecordsOfDate = async (db: SQLiteDatabase, date: number, cells: FullCell[], retry: boolean): Promise<FullAttendanceRecord[]> => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);

  const depoch = d.getTime() / 1000 / 60;

  const res = await db.getAllAsync<FullAttendanceRecord>(
    `SELECT
      records.*,
      subjects.name as subjectName,
      subjects.shortName as subjectShortName,
      subjects.total as subjectTotal,
      subjects.off as subjectOff,
      subjects.present as subjectPresent
    FROM records
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
      await Promise.all(cells.map(cell => {
        const record = {
          subjectId: cell?.subjectId || null,
          startTimeMinsSinceEpoch: d.getTime() / 1000 / 60 + cell.startTime,
          durationMins: cell.duration,
          status: null
        };

        return insertRecord(db, record);
      }));

      const res = await getFullRecordsOfDate(db, date, cells, false);

      return res;
    }
  }

  return res;
}

export const getGroupedRecordsOfSubject = async (db: SQLiteDatabase, subjectId: number) => {
  const res = await db.getAllAsync<AttendanceRecord>(
    `SELECT *
    FROM records
    WHERE subjectId = ?
    ORDER BY startTimeMinsSinceEpoch DESC`,
    [subjectId]
  );

  console.log("$$", res);

  if (res.length === 0) return [];

  const out = [] as AttendanceRecord[][];

  let tmp = [] as AttendanceRecord[];
  let last = new Date(res[0].startTimeMinsSinceEpoch * 60 * 1000).setUTCHours(0, 0, 0, 0);

  for (const record of res) {
    const curr = new Date(record.startTimeMinsSinceEpoch * 60 * 1000).setUTCHours(0, 0, 0, 0);

    if (curr === last) {
      tmp.push(record);
    } else {
      out.push(tmp);
      tmp = [record];
      last = curr;
    }
  }
  if (tmp.length > 0) out.push(tmp);

  return out;
};

export const insertRecord = async (db: SQLiteDatabase, record: InsertAttendanceRecord) => {
  if (record.subjectId === null && record.status !== null) {
    throw new Error("Subject ID cannot be null if status is not null");
  }

  const res = await db.runAsync(
    `INSERT INTO records (startTimeMinsSinceEpoch, durationMins, subjectId, status, isExtra) VALUES (?, ?, ?, ?, ?)`,
    [record.startTimeMinsSinceEpoch, record.durationMins, record.subjectId, record.status, record.isExtra ? 1 : 0]
  );

  return res.lastInsertRowId;
}

export const updateRecordStatus = async (db: SQLiteDatabase, record: AttendanceRecord, to: Status) => {
  if (record.subjectId === null) return;

  await db.runAsync(
    `UPDATE records SET status = ? WHERE id = ?`,
    [to, record.id]
  );
  console.log("$#", await db.getAllAsync(`SELECT * FROM records WHERE id = ?`, [record.id]));
  await updateSubjectAttendance(db, record.subjectId, record.status, to);

  console.log(`Updated record ${record.status} to ${to}`);
};
