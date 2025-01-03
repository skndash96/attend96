import { SQLiteDatabase } from "expo-sqlite"

export const initDb = async (db: SQLiteDatabase) => {
  await db.execAsync(`
-- Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY,
    idx INTEGER NOT NULL,
    name TEXT NOT NULL,
    shortName TEXT NOT NULL UNIQUE,
    total INTEGER NOT NULL DEFAULT 0 CHECK(total >= 0),
    off INTEGER NOT NULL DEFAULT 0 CHECK(off >= 0),
    present INTEGER NOT NULL DEFAULT 0 CHECK(present >= 0)
);

-- Timetable Table
CREATE TABLE IF NOT EXISTS timetable (
    id INTEGER PRIMARY KEY,
    subjectId INTEGER,
    day INTEGER NOT NULL CHECK(day BETWEEN 0 AND 6),
    idx INTEGER NOT NULL,
    startTime INTEGER NOT NULL,
    duration INTEGER NOT NULL CHECK(duration > 0),
    FOREIGN KEY(subjectId) REFERENCES subjects(id) ON DELETE RESTRICT,
    UNIQUE(day, idx) ON CONFLICT REPLACE
);
CREATE INDEX IF NOT EXISTS idx_timetable_subject ON timetable(subjectId);
CREATE INDEX IF NOT EXISTS idx_timetable_day_idx ON timetable(day, idx);
-- TODO Create suitable indexes

-- Records/Attendance Table
CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY,
    startTimeMinsSinceEpoch INTEGER NOT NULL,
    durationMins INTEGER NOT NULL CHECK(durationMins > 0),
    isExtra INTEGER CHECK(isExtra IN (0, 1)) DEFAULT 0,
    subjectId INTEGER,
    status INTEGER CHECK(status IN (-1, 0, 1)),
    FOREIGN KEY(subjectId) REFERENCES subjects(id) ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS idx_records_subject ON records(subjectId);
CREATE INDEX IF NOT EXISTS idx_records_start_time ON records(startTimeMinsSinceEpoch);
-- TODO: Create suitable indexes
  `);

  console.log('Database initialized');
}

const seed = `
  -- Subjects
  INSERT INTO subjects (idx, name, shortName)
  VALUES
    (1, 'Mathematics', 'Math'),
    (2, 'Physics', 'Phys'),
    (3, 'Chemistry', 'Chem'),
    (4, 'Biology', 'Bio'),
    (5, 'History', 'Hist'),
    (6, 'Geography', 'Geo'),
    (7, 'English Literature', 'Eng'),
    (8, 'Computer Science', 'CS'),
    (9, 'Physical Education', 'PE'),
    (10, 'Art', 'Art');
  
  -- Timetable
  INSERT INTO timetable (subjectId, day, idx, startTime, duration)
  VALUES
    (NULL, 1, 1, 510, 50),  -- Free class on Monday at 8:30 AM
    (2, 1, 2, 560, 50),     -- Physics on Monday at 9:20 AM
    (3, 1, 3, 610, 50),     -- Chemistry on Monday at 10:10 AM
    (4, 2, 1, 510, 50),     -- Biology on Tuesday at 8:30 AM
    (5, 2, 2, 560, 50),     -- History on Tuesday at 9:20 AM
    (6, 2, 3, 610, 50),     -- Geography on Tuesday at 10:10 AM
    (7, 3, 1, 510, 50),     -- English Literature on Wednesday at 8:30 AM
    (8, 3, 2, 560, 50),     -- Computer Science on Wednesday at 9:20 AM
    (NULL, 3, 3, 610, 50),  -- Free class on Wednesday at 10:10 AM
    (10, 4, 1, 510, 50),    -- Art on Thursday at 8:30 AM
    (1, 4, 2, 560, 50),     -- Mathematics on Thursday at 9:20 AM
    (2, 4, 3, 610, 50),     -- Physics on Thursday at 10:10 AM
    (3, 4, 4, 660, 50),     -- Chemistry on Thursday at 11:00 AM
    (4, 5, 1, 510, 50),     -- Biology on Friday at 8:30 AM
    (5, 5, 2, 560, 50),     -- History on Friday at 9:20 AM
    (NULL, 5, 3, 610, 50),  -- Free class on Friday at 10:10 AM
    (6, 5, 4, 660, 50);     -- Geography on Friday at 11:00 AM
`;