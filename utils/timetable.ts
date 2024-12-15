import { SQLiteDatabase } from "expo-sqlite";
import { getAllSlotsCount } from "./slots";

export interface Cell {
  id: number
  subjectId: number
  day: number // 0-6 (Sun-Sat)
  idx: number
}

export interface FullCell extends Cell {
  subjectName: string,
  subjectShortName: string
}

export const getCell = async (db: SQLiteDatabase, id: number) => {
  const res = await db.getFirstAsync<Cell>(`
    SELECT *
    FROM timetable
    WHERE id = ?
  `, [id]);
  return res;
};

export const getFullCells = async (db: SQLiteDatabase) => {
  const res = await db.getAllAsync<FullCell>(`
    SELECT 
      timetable.*, 
      subjects.name as subjectName, 
      subjects.shortName as subjectShortName
    FROM timetable
    LEFT JOIN subjects
      ON timetable.subjectId = subjects.id
    ORDER BY idx, day ASC
  `);

  return res;
};

export const getTimetableOfDay = async (db: SQLiteDatabase, day: number) => {
  const res = await db.getAllAsync<FullCell>(`
    SELECT 
      timetable.*, 
      subjects.name as subjectName, 
      subjects.shortName as subjectShortName
    FROM timetable
    JOIN subjects
      ON timetable.subjectId = subjects.id
    WHERE day = ?
    ORDER BY idx ASC
  `, [day]);

  return res;
};

export const getTimetable = async (db: SQLiteDatabase) => {
  const cells = await getFullCells(db);

  const timetable: (FullCell|null)[][] = [[], [], [], [], [], [], []];

  for (let cell of cells) {
    let k = timetable[cell.day].length;
    while (k < cell.idx) {
      timetable[cell.day].push(null);
      k++;
    }

    timetable[cell.day].push(cell);
  }

  const slotsCount = await getAllSlotsCount(db);
  for (let i = 0; i < 7; i++) {
    while (timetable[i].length < slotsCount) {
      timetable[i].push(null);
    }
  }

  return timetable;
};

export const orderCellsIdx = async (db: SQLiteDatabase, cells: (FullCell | null)[]) => {
  const day = cells.find(c => c !== null)!.day;
  
  const dayValidation = cells.every(c => c === null || c!.day === day);
  if (!dayValidation) {
    throw new Error("All cells must be of the same day");
  }

  //change to temporary negative index
  let q = `UPDATE timetable SET idx = -idx-1 WHERE day = ${day};`;
  //                                      ^ -1 for changing zero index to -1

  for (let i = 0; i < cells.length; i++) {
    if (cells[i] !== null) {
      q += `
        UPDATE timetable 
        SET idx = ${i} 
        WHERE id = ${cells[i]!.id};
      `;
    }
  }

  //revert negative indexes
  q += `UPDATE timetable SET idx = -idx-1 WHERE day = ${day} AND idx < 0;`;

  await db.execAsync(q);
  return cells.length;
};

export const addCell = async (db: SQLiteDatabase, cell: Omit<Cell, "id">) => {
  const res = await db.runAsync(`
    INSERT INTO timetable (subjectId, day, idx)
    VALUES (?, ?, ?)
  `, [cell.subjectId, cell.day, cell.idx]);

  return res.lastInsertRowId;
};

export const deleteCells = async (db: SQLiteDatabase, ids: (number)[]) => {
  const res = await db.runAsync(`
    DELETE FROM timetable 
    WHERE id IN (${ids.join(",")})
  `);

  
  return res.changes;
};
