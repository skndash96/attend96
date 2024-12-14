import { SQLiteDatabase } from "expo-sqlite";

export interface Subject {
  id: number;
  idx: number; //-1 for deleted
  name: string;
  shortName?: string;
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
  return res?.count || 0;
};

export const getSubjectsIncludingDeleted = async (db: SQLiteDatabase) => {
  return await db.getAllAsync<Subject>(`
    SELECT *
    FROM subjects
    ORDER BY idx ASC`
  );
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
  const res = await db.runAsync(`
    INSERT INTO subjects (idx, name, shortName)
    VALUES (?, ?, ?)`,
    [idx, name, shortName]
  );
  
  return res.lastInsertRowId;
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

export const updateSubject = async (db: SQLiteDatabase, id: number, name: string, shortName: string) => {
  const res = await db.runAsync(`
    UPDATE subjects
    SET name = ?, shortName = ?
    WHERE id = ?`,
    [name, shortName, id]
  );

  return res.changes;
};

export const safeDeleteSubject = async (db: SQLiteDatabase, id: number) => {
  const res = await db.runAsync(`
    UPDATE subjects
    SET idx = -1
    WHERE id = ?`,
    [id]
  );

  return res.changes;
};

export const restoreSubject = async (db: SQLiteDatabase, id: number) => {
  const res = await db.runAsync(`
    UPDATE subjects
    SET idx = 0
    WHERE id = ?`,
    [id]
  );

  return res.changes;
};

export const unsafeDeleteSubject = async (db: SQLiteDatabase, id: number) => {
  // This is a dangerous operation, as it will delete the subject and
  // all associated Attendance records
  const res = await db.runAsync(`
    DELETE FROM subjects
    WHERE id = ?`,
    [id]
  );

  return res.changes;
};