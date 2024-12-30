import { SQLiteDatabase } from "expo-sqlite";

export interface Slot {
  id: number;
  idx: number;
  startTime: number; //minutes since 00:00AM
  duration: number; //in minutes
}

export interface InsertSlot extends Omit<Omit<Slot, 'id'>, 'idx'> {};

export const getAllSlots = async (db: SQLiteDatabase) => {
  const res = await db.getAllAsync<Slot>(`
  SELECT *
  FROM slots
  ORDER BY startTime, idx
  `);

  return res;
}

export const getSlotByIdx = async (db: SQLiteDatabase, idx: number) => {
  const res = await db.getFirstAsync<Slot>(`
  SELECT *
  FROM slots
  WHERE idx = ${idx}
  `);

  return res;
};

export const getAllSlotsCount = async (db: SQLiteDatabase) => {
  const res = await db.getFirstAsync<{count: number}>(`
  SELECT COUNT(*) as count
  FROM slots
  `);

  return res?.count || 0;
};

export const insertSlot = async (db: SQLiteDatabase, slot: InsertSlot) => {
  const count = await getAllSlotsCount(db);

  const res = await db.runAsync(`
  INSERT INTO slots (idx, startTime, duration)
  VALUES (?, ?, ?)
  `, [count, slot.startTime, slot.duration]);

  return res.changes;
}

export const updateSlot = async (db: SQLiteDatabase, slot: Slot) => {
  const res = await db.runAsync(`
    UPDATE slots
    SET idx = ?, startTime = ?, duration = ?
    WHERE id = ${slot.id}`,
    [slot.idx, slot.startTime, slot.duration]
  );

  return res.changes;
};

export const deleteSlots = async (db: SQLiteDatabase, ids: number[]) => {
  const res = await db.runAsync(`
    DELETE FROM slots
    WHERE id IN (${ids.join(',')});
  `);

  const slots = await getAllSlots(db);

  await orderSlotsIdx(db, slots);

  return res.changes;
};

export const orderSlotsIdx = async (db: SQLiteDatabase, slots: Slot[]) => {
  let q = ``;

  for (let i = 0; i < slots.length; i++) {
    q += `
      UPDATE slots
      SET idx = ${i}
      WHERE id = ${slots[i].id};
    `;
  }

  await db.execAsync(q);
};