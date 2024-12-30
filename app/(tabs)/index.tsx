import SubjectRecord from '@/components/home/SubjectRecord';
import { FullAttendanceRecord, getFullRecordsOfToday } from '@/utils/records';
import { getAllSlots, Slot } from '@/utils/slots';
import { FullCell, getTimetableOfDay } from '@/utils/timetable';
import { useIsFocused } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Text, View } from 'react-native'

export default function Home() {
  const db = useSQLiteContext();
  const isFocused = useIsFocused();
  const [cells, setCells] = useState<(FullCell | null)[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [records, setRecords] = useState<(FullAttendanceRecord)[]>([]);
  const [counter, setCounter] = useState(0);

  useLayoutEffect(() => {
    const day = new Date().getDay();

    getTimetableOfDay(db, day)
      .then((cells) => setCells(cells))
      .catch((e) => console.error(e));

    getAllSlots(db)
      .then((slots) => setSlots(slots))
      .catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    if (!isFocused) return;
    
    console.log("loading");
    getFullRecordsOfToday(db, cells, slots, true)
      .then((records) => {
        //TODO: merge records so that they go hand in hand with cells in case timetable got updated

        setRecords(records);
      })
      .catch((e) => console.error(e));
  }, [isFocused, counter, cells, slots]);

  const handleStatusChange = () => {
    setCounter(counter + 1);
  };

  return (
    <View style={{
      flex: 1,
      marginTop: 10,
      marginBottom: 20
    }}>
      {records.map((record, i) => (
        <SubjectRecord
          onStatusChange={handleStatusChange}
          slot={slots[i]}
          record={record}
          key={record.id}
        />
      ))}
    </View>
  );
}
