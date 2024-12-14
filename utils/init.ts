import { SQLiteDatabase } from "expo-sqlite"

export const initDb = async (db: SQLiteDatabase) => {
  await db.execAsync(`
-- Drop Tables
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS timetable;
DROP TABLE IF EXISTS records;

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
    FOREIGN KEY(subjectId) REFERENCES subjects(id) ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS idx_timetable_subject ON timetable(subjectId);
CREATE INDEX IF NOT EXISTS idx_timetable_day_idx ON timetable(day, idx);

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

-- Seed Data
${seed}
  `);

  console.log('Database initialized');
}

const seed = `
INSERT INTO subjects (id, idx, name, shortName) VALUES (1, 0, 'Mathematics', 'MATH');
INSERT INTO subjects (id, idx, name, shortName) VALUES (2, 1, 'Physics', 'PHYS');
INSERT INTO subjects (id, idx, name, shortName) VALUES (3, 2, 'Chemistry', 'CHEM');
INSERT INTO subjects (id, idx, name, shortName) VALUES (4, 3, 'Biology', 'BIOL');
INSERT INTO subjects (id, idx, name, shortName) VALUES (5, 4, 'English', 'ENG');
INSERT INTO subjects (id, idx, name, shortName) VALUES (6, 5, 'History', 'HIST');
INSERT INTO subjects (id, idx, name, shortName) VALUES (7, 6, 'Computer Science', 'CS');
INSERT INTO subjects (id, idx, name, shortName) VALUES (8, 7, 'Economics', 'ECON');
INSERT INTO subjects (id, idx, name, shortName) VALUES (9, 8, 'Art', 'ART');
INSERT INTO subjects (id, idx, name, shortName) VALUES (10, 9, 'Physical Education', 'PE');

-- Day 0 (Sunday)
INSERT INTO timetable (id, subjectId, day, idx) VALUES (1, 1, 0, 1); -- Mathematics
INSERT INTO timetable (id, subjectId, day, idx) VALUES (2, 2, 0, 2); -- Physics
INSERT INTO timetable (id, subjectId, day, idx) VALUES (3, 3, 0, 3); -- Chemistry

-- Day 1 (Monday)
INSERT INTO timetable (id, subjectId, day, idx) VALUES (4, 4, 1, 1); -- Biology
INSERT INTO timetable (id, subjectId, day, idx) VALUES (5, 5, 1, 2); -- English
INSERT INTO timetable (id, subjectId, day, idx) VALUES (6, 6, 1, 3); -- History
INSERT INTO timetable (id, subjectId, day, idx) VALUES (7, 7, 1, 4); -- Computer Science
INSERT INTO timetable (id, subjectId, day, idx) VALUES (8, 8, 1, 5); -- Economics

-- Day 2 (Tuesday)
INSERT INTO timetable (id, subjectId, day, idx) VALUES (9, 9, 2, 1); -- Art
INSERT INTO timetable (id, subjectId, day, idx) VALUES (10, 10, 2, 2); -- Physical Education
INSERT INTO timetable (id, subjectId, day, idx) VALUES (11, 1, 2, 3); -- Mathematics
INSERT INTO timetable (id, subjectId, day, idx) VALUES (12, 2, 2, 4); -- Physics
INSERT INTO timetable (id, subjectId, day, idx) VALUES (13, 3, 2, 5); -- Chemistry

-- Day 3 (Wednesday)
INSERT INTO timetable (id, subjectId, day, idx) VALUES (14, 4, 3, 1); -- Biology
INSERT INTO timetable (id, subjectId, day, idx) VALUES (15, 5, 3, 2); -- English
INSERT INTO timetable (id, subjectId, day, idx) VALUES (16, 6, 3, 3); -- History
INSERT INTO timetable (id, subjectId, day, idx) VALUES (17, 7, 3, 4); -- Computer Science
INSERT INTO timetable (id, subjectId, day, idx) VALUES (18, 8, 3, 5); -- Economics
INSERT INTO timetable (id, subjectId, day, idx) VALUES (19, 9, 3, 6); -- Art

-- Day 4 (Thursday)
INSERT INTO timetable (id, subjectId, day, idx) VALUES (20, 10, 4, 1); -- Physical Education
INSERT INTO timetable (id, subjectId, day, idx) VALUES (21, 1, 4, 2); -- Mathematics
INSERT INTO timetable (id, subjectId, day, idx) VALUES (22, 2, 4, 3); -- Physics
INSERT INTO timetable (id, subjectId, day, idx) VALUES (23, 3, 4, 4); -- Chemistry
INSERT INTO timetable (id, subjectId, day, idx) VALUES (24, 4, 4, 5); -- Biology

-- Day 5 (Friday)
INSERT INTO timetable (id, subjectId, day, idx) VALUES (25, 5, 5, 1); -- English
INSERT INTO timetable (id, subjectId, day, idx) VALUES (26, 6, 5, 2); -- History
INSERT INTO timetable (id, subjectId, day, idx) VALUES (27, 7, 5, 3); -- Computer Science
INSERT INTO timetable (id, subjectId, day, idx) VALUES (28, 8, 5, 4); -- Economics
INSERT INTO timetable (id, subjectId, day, idx) VALUES (29, 9, 5, 5); -- Art

-- Day 6 (Saturday)
INSERT INTO timetable (id, subjectId, day, idx) VALUES (30, 10, 6, 1); -- Physical Education
INSERT INTO timetable (id, subjectId, day, idx) VALUES (31, 1, 6, 2); -- Mathematics
INSERT INTO timetable (id, subjectId, day, idx) VALUES (32, 2, 6, 3); -- Physics
INSERT INTO timetable (id, subjectId, day, idx) VALUES (33, 3, 6, 4); -- Chemistry
INSERT INTO timetable (id, subjectId, day, idx) VALUES (34, 4, 6, 5); -- Biology

INSERT INTO records (id, startTimestamp, duration, subjectId, status) VALUES (1, 1702185600, 60, 1, 1); -- Present
INSERT INTO records (id, startTimestamp, duration, subjectId, status) VALUES (2, 1702185600, 60, 2, -1); -- Absent
INSERT INTO records (id, startTimestamp, duration, subjectId, status) VALUES (3, 1702185600, 60, 3, 0); -- Neutral

INSERT INTO records (id, startTimestamp, duration, subjectId, status) VALUES (4, 1702272000, 60, 4, 1);
INSERT INTO records (id, startTimestamp, duration, subjectId, status) VALUES (5, 1702272000, 60, 5, 1);
INSERT INTO records (id, startTimestamp, duration, subjectId, status) VALUES (6, 1702272000, 60, 6, 0);

INSERT INTO records (id, startTimestamp, duration, subjectId, status) VALUES (7, 1702358400, 60, 7, -1);
INSERT INTO records (id, startTimestamp, duration, subjectId, status) VALUES (8, 1702358400, 60, 8, 1);
INSERT INTO records (id, startTimestamp, duration, subjectId, status) VALUES (9, 1702358400, 60, 9, 1);
INSERT INTO records (id, startTimestamp, duration, subjectId, status) VALUES (10, 1702358400, 60, 10, 0);
`;