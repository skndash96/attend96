import { SQLiteDatabase } from "expo-sqlite"

export const initDb = async (db: SQLiteDatabase) => {
  await db.execAsync(`
-- Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY,
    idx INTEGER NOT NULL,
    name TEXT NOT NULL,
    shortName TEXT NOT NULL UNIQUE
);

-- Timetable Table
CREATE TABLE IF NOT EXISTS timetable (
    id INTEGER PRIMARY KEY,
    subjectId INTEGER NOT NULL,
    day INTEGER NOT NULL CHECK(day BETWEEN 0 AND 6),
    idx INTEGER NOT NULL,
    FOREIGN KEY(subjectId) REFERENCES subjects(id) ON DELETE RESTRICT,
    UNIQUE(day, idx) ON CONFLICT REPLACE
);
CREATE INDEX IF NOT EXISTS idx_timetable_subject ON timetable(subjectId);
CREATE INDEX IF NOT EXISTS idx_timetable_day_idx ON timetable(day, idx);

CREATE TABLE IF NOT EXISTS slots (
    id INTEGER PRIMARY KEY,
    idx INTEGER NOT NULL,
    startTime INTEGER NOT NULL,
    duration INTEGER NOT NULL
);
-- TODO: Create index

-- Records/Attendance Table
CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY,
    startTimestamp INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    duration INTEGER NOT NULL CHECK(duration > 0),
    subjectId INTEGER NOT NULL,
    status INTEGER CHECK(status IN (-1, 0, 1)),
    FOREIGN KEY(subjectId) REFERENCES subjects(id) ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS idx_records_subject ON records(subjectId);
-- TODO: Create suitable indexes
  `);

  console.log('Database initialized');
}
