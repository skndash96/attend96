import AddExtraClassModal from '@/components/home/AddExtraClassModal';
import SubjectRecord from '@/components/home/SubjectRecord';
import Icon from '@/components/Icon';
import { FullAttendanceRecord, getFullRecordsOfToday } from '@/utils/records';
import { getSubjects, Subject } from '@/utils/subjects';
import { FullCell, getTimetableOfDay } from '@/utils/timetable';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useLayoutEffect, useState } from 'react';
import { BackHandler, Pressable, View } from 'react-native'
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

  useEffect(() => {
    if (!isFocused) return;

    const day = new Date().getDay();

    getTimetableOfDay(db, day)
      .then((cells) => {
        setCells(cells);
        
        getFullRecordsOfToday(db, cells, true)
          .then((records) => {
            //TODO: merge records so that they go hand in hand with cells in case timetable got updated
            setRecords(records);
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));

    getSubjects(db)
      .then((subs) => setSubjects(subs))
      .catch((e) => console.error(e));
  }, [isFocused, counter]);

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
  }, []);

  useLayoutEffect(() => {
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
      padding: 10
    }}>
      <AddExtraClassModal
        visible={addExtraClassModalVisible}
        onClose={handleAddExtraClass}
        cells={cells}
        subjects={subjects}
        addAtDayTimestamp={Date.now()}
      />

      <View style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}>
        {records.map((record, i) => (
          <SubjectRecord
            onStatusChange={handleStatusChange}
            record={record}
            key={record.id}
          />
        ))}
      </View>
    </ScrollView>
  );
}
