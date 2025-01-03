import AddExtraClassModal from '@/components/home/AddExtraClassModal';
import SubjectRecord from '@/components/home/SubjectRecord';
import Icon from '@/components/Icon';
import { displayDate, displayTime } from '@/utils/functions';
import { FullAttendanceRecord, getFullRecordsOfToday } from '@/utils/records';
import { getSubject, getSubjects, Subject } from '@/utils/subjects';
import { FullCell, getTimetableOfDay } from '@/utils/timetable';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Fragment, useEffect, useLayoutEffect, useState } from 'react';
import { BackHandler, Pressable, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';

export default function Home() {
  const db = useSQLiteContext();
  const navigator = useNavigation();
  const isFocused = useIsFocused();
  const [cells, setCells] = useState<FullCell[]>([]);
  const [records, setRecords] = useState<(FullAttendanceRecord)[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [counter, setCounter] = useState(0);
  const [addExtraClassModalVisible, setAddExtraClassModalVisible] = useState(false);

  useLayoutEffect(() => {
    const day = new Date().getDay();

    getTimetableOfDay(db, day)
      .then((cells) => setCells(cells))
      .catch((e) => console.error(e));
  }, []);

  useLayoutEffect(() => {
    if (!isFocused) return;

    getFullRecordsOfToday(db, cells, true)
      .then((records) => {
        //TODO: merge records so that they go hand in hand with cells in case timetable got updated
        setRecords(records);
      })
      .catch((e) => console.error(e));

    getSubjects(db)
      .then((subs) => setSubjects(subs))
      .catch((e) => console.error(e));
  }, [isFocused, counter, cells]);

  useLayoutEffect(() => {
    navigator.setOptions({
      headerRight() {
        return (
          <Pressable onPress={() => setAddExtraClassModalVisible(true)} android_ripple={{ color: 'gray' }} style={{
            marginRight: 10
          }}>
            <Icon name="add" size={24} color="royalblue" />
          </Pressable>
        );
      }
    });

    const backHandler = () => {
      if (addExtraClassModalVisible) {
        setAddExtraClassModalVisible(false);
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', backHandler);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backHandler);
    };
  }, [addExtraClassModalVisible]);

  const handleStatusChange = () => {
    setCounter(counter + 1);
  };

  const handleAddExtraClass = (added: boolean) => {
    if (added) setCounter(counter + 1);

    setAddExtraClassModalVisible(false);
  };

  return (
    <ScrollView style={{
      flex: 1,
      marginBottom: 20
    }}>
      <AddExtraClassModal
        visible={addExtraClassModalVisible}
        onClose={handleAddExtraClass}
        cells={cells}
        subjects={subjects}
        addAtDayTimestamp={Date.now()}
      />

      {records.map((record, i) => (
        <SubjectRecord
          onStatusChange={handleStatusChange}
          record={record}
          key={record.id}
        />
      ))}
    </ScrollView>
  );
}
