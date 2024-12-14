import { SQLiteDatabase } from "expo-sqlite";

type Status = -1 | 0 | 1 //1 for present, -1 for absent, 0 for didnt occur

export interface AttendanceRecord {
  id: number;
  startTimestamp: number; //seconds since epoch
  duration: number; //minutes
  subjectId: number;
  status: Status | null; //null for not marked
}

export interface FullAttendanceRecord extends AttendanceRecord {
  subjectName: string;
  subjectShortName: string;
};

export interface InsertAttendanceRecord extends Omit<AttendanceRecord, 'id'> {
};

export const getFullRecordsOfToday = async (db: SQLiteDatabase): Promise<FullAttendanceRecord[]> => {
  return getFullRecordsOfDate(db, Date.now());
}

export const getFullRecordsOfDate = async (db: SQLiteDatabase, date: number): Promise<FullAttendanceRecord[]> => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const sec = Math.floor(d.getTime() / 1000);

  const res = await db.getAllAsync<FullAttendanceRecord>(
    `SELECT records.*, subjects.name as subjectName, subjects.shortName as subjectShortName FROM records
    LEFT JOIN subjects ON records.subjectId = subjects.id
    WHERE startTimestamp >= ? 
    AND startTimestamp < ? + 86400
    ORDER BY id`, 
    [
      sec,
      sec
    ]
  );

  return res;
}

export const insertRecord = async (db: SQLiteDatabase, record: InsertAttendanceRecord): Promise<void> => {
  await db.runAsync(
    `INSERT INTO records (startTimestamp, duration, subjectId, status) VALUES (?, ?, ?, ?)`,
    [record.startTimestamp, record.duration, record.subjectId, record.status]
  );
}

export const updateRecordStatus = async (db: SQLiteDatabase, record: AttendanceRecord, to: Status): Promise<void> => {
  await db.runAsync(
    `UPDATE records SET status = ? WHERE id = ?`,
    [to, record.id]
  );
};
