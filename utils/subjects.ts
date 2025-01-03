import { SQLiteDatabase } from "expo-sqlite";
import { Status } from "./records";

export interface Subject {
  id: number;
  idx: number; //-1 for deleted
  name: string;
  shortName: string;
  total: number;
  off: number;
  present: number;
}

export const getSubjects = async (db: SQLiteDatabase) => {
  return await db.getAllAsync<Subject>(`
    SELECT *
    FROM subjects
    WHERE idx != -1
    ORDER BY idx ASC`
  );
};

export const getSubjectsCount = async (db: SQLiteDatabase) => {
  const res = await db.getFirstAsync<{ count: number }>(`
    SELECT COUNT(*) as count
    FROM subjects
    WHERE idx != 1`
  );

  return res?.count ?? 0;
};

export const getSubject = async (db: SQLiteDatabase, id: number) => {
  return await db.getFirstAsync<Subject>(`
    SELECT *
    FROM subjects
    WHERE id = ?`,
    [id]
  );
};

export const createSubject = async (db: SQLiteDatabase, name: string, shortName: string) => {
  const idx = await getSubjectsCount(db);
  
  await db.runAsync(`
    INSERT INTO subjects (idx, name, shortName)
    VALUES (?, ?, ?)`,
    [idx, name, shortName]
  );
};

export const orderSubjectsIdx = async (db: SQLiteDatabase, subjects: Subject[]) => {
  let q = ``;

  for (let i = 0; i < subjects.length; i++) {
    q += `
    UPDATE subjects
    SET idx = ${i}
    WHERE id = ${subjects[i].id};`;
  }

  await db.execAsync(q);
};

export const updateSubjectAttendance = async (db: SQLiteDatabase, id: number, fromStatus: Status, toStatus: Status) => {
  const t = (n: Status) => (n === 1 || n === -1) ? 1 : 0;
  const p = (n: Status) => (n === 1) ? 1 : 0;
  const o = (n: Status) => (n === 0) ? 1 : 0;

  await db.runAsync(`
    UPDATE subjects
    SET
      total = total + ?,
      present = present + ?,
      off = off + ?
    WHERE id = ?`,
    [
      t(toStatus) - t(fromStatus),
      p(toStatus) - p(fromStatus),
      o(toStatus) - o(fromStatus),
      id
    ]
  );
}

export const updateSubject = async (db: SQLiteDatabase, from: Subject, { name, shortName } : { name?: string, shortName?: string }) => {
  let q = `UPDATE subjects SET `;
  
  const initQLength = q.length;
  
  if (name && name !== from.name) q += `name = '${name}', `;
  if (shortName && shortName !== from.shortName) q += `shortName = '${shortName}', `;
  
  //no set values
  if (q.length === initQLength) return;
  
  q = q.slice(0, -2);
  q += ` WHERE id = ${from.id}`;

  await db.runAsync(q);
};

export const safeDeleteSubject = async (db: SQLiteDatabase, id: number) => {
  await db.runAsync(`
    UPDATE subjects
    SET idx = -1
    WHERE id = ?`,
    [id]
  );
};

export const restoreSubject = async (db: SQLiteDatabase, id: number) => {
  await db.runAsync(`
    UPDATE subjects
    SET idx = 0
    WHERE id = ?`,
    [id]
  );
};

export const unsafeDeleteSubject = async (db: SQLiteDatabase, id: number) => {
  // This is a dangerous operation, as it will delete the subject and
  // all associated Attendance records
  await db.runAsync(`
    DELETE FROM subjects
    WHERE id = ?`,
    [id]
  );
};