import { SQLiteDatabase } from "expo-sqlite";

export interface Cell {
  id: number
  subjectId: number | null
  day: number // 0-6 (Sun-Sat)
  idx: number
  startTime: number //minutes from 00:00
  duration: number //minutes
}

export interface FullCell extends Cell {
  subjectName?: string,
  subjectShortName?: string,
  subjectTotal?: number,
  subjectPresent?: number,
  subjectOff?: number
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
      subjects.shortName as subjectShortName,
      subjects.total as subjectTotal,
      subjects.present as subjectPresent,
      subjects.off as subjectOff
    FROM timetable
    LEFT JOIN subjects
      ON timetable.subjectId = subjects.id
    ORDER BY day, idx ASC
  `);

  return res;
};

export const getTimetableOfDay = async (db: SQLiteDatabase, day: number) => {
  return await db.getAllAsync<FullCell>(`
    SELECT 
      timetable.*, 
      subjects.name as subjectName, 
      subjects.shortName as subjectShortName,
      subjects.total as subjectTotal,
      subjects.present as subjectPresent,
      subjects.off as subjectOff
    FROM timetable
    LEFT JOIN subjects
      ON timetable.subjectId = subjects.id
    WHERE day = ?
    ORDER BY idx ASC
  `, [day]);
};

export const getTimetable = async (db: SQLiteDatabase) => {
  const out = [[], [], [], [], [], [], []] as FullCell[][];

  const cells = await getFullCells(db);

  for (let cell of cells) {
    out[cell.day].push(cell);
  }

  return out;
};

export const orderCellsIdx = async (db: SQLiteDatabase, cells: FullCell[]) => {
  const day = cells[0].day;
  
  const dayValidation = cells.every(c => c.day === day);
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
};

export const addCell = async (db: SQLiteDatabase, cell: Omit<Omit<Cell, "id">, 'idx'>) => {
  const cells = await getTimetableOfDay(db, cell.day);
  
  const idx = Math.max(...cells.map(c => c.idx), -1) + 1;

  await db.runAsync(`
    INSERT INTO timetable (subjectId, day, idx, startTime, duration)
    VALUES (?, ?, ?, ?, ?)
  `, [cell.subjectId, cell.day, idx, cell.startTime, cell.duration]);
};

export const updateCell = async (db: SQLiteDatabase, cell: Omit<Omit<Cell, 'day'>, 'idx'>) => {
  await db.runAsync(`
    UPDATE timetable
    SET startTime = ?, duration = ?, subjectId = ?
    WHERE id = ?
  `, [cell.startTime, cell.duration, cell.subjectId, cell.id]);
};

export const deleteCells = async (db: SQLiteDatabase, ids: (number)[]) => {
  await db.runAsync(`
    DELETE FROM timetable 
    WHERE id IN (${ids.join(",")})
  `);
};
