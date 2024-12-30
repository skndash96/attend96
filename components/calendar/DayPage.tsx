import { useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { BackHandler, Pressable, ScrollView, Text, View } from "react-native";
import Icon from "../Icon";
import { FullAttendanceRecord, getFullRecordsOfDate } from "@/utils/records";
import { useSQLiteContext } from "expo-sqlite";
import SubjectRecord from "../home/SubjectRecord";
import { displayDate, displayTimeSinceEpoch, epochStartTimeToStartTime } from "@/utils/functions";

export default function DayPage({
  timestamp,
  onClose
}: {
  timestamp: number,
  onClose: () => void
}) {
  const db = useSQLiteContext();
  const navigator = useNavigation();
  const [records, setRecords] = useState<FullAttendanceRecord[]>([]);
  const [counter, setCounter] = useState(0);

  const onStatusChange = () => {
    setCounter(counter + 1);
  };

  useEffect(() => {
    getFullRecordsOfDate(db, timestamp, [], [], false)
      .then((records) => {
        setRecords(records);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [counter]);

  useEffect(() => {
    const backHandler = () => {
      onClose();
      return true;
    };

    navigator.setOptions({
      headerLeft() {
        return (
          <Pressable
            onPress={onClose}
            android_ripple={{ color: 'lightgray' }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <Icon name="arrow-back" size={24} color="black" />
          </Pressable>
        );
      }
    });

    BackHandler.addEventListener('hardwareBackPress', backHandler);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backHandler);
    };
  }, []);

  return (
    <ScrollView>
      <Text style={{
        padding: 20,
        paddingBottom: 0,
        paddingLeft: 10,
        fontSize: 18,
      }}>
        {displayDate(timestamp)}
      </Text>
      
      <View style={{
        padding: 10
      }}>
        {records.map((record, i) => (
          <SubjectRecord
            onStatusChange={onStatusChange}
            slot={{
              startTime: epochStartTimeToStartTime(record.startTimeMinsSinceEpoch),
              duration: record.durationMins
            }}
            key={record.id}
            record={record}
          />
        ))}
        {records.length === 0 && (
          <Text>
            No records found for this day
          </Text>
        )}
      </View>
    </ScrollView>
  );
}