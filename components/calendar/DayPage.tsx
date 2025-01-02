import { useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { BackHandler, Pressable, ScrollView, Text, View } from "react-native";
import Icon from "../Icon";
import { FullAttendanceRecord, getFullRecordsOfDate } from "@/utils/records";
import { useSQLiteContext } from "expo-sqlite";
import SubjectRecord from "../home/SubjectRecord";
import { displayDate, displayTimeSinceEpoch, epochStartTimeToStartTime } from "@/utils/functions";
import Animated, { SlideInRight } from "react-native-reanimated";
import AddExtraClassModal from "../home/AddExtraClassModal";
import { Subject } from "@/utils/subjects";
import { useIsFocused } from "@react-navigation/native";

export default function DayPage({
  timestamp,
  subjects,
  onClose
}: {
  timestamp: number,
  subjects: Subject[],
  onClose: () => void
}) {
  const db = useSQLiteContext();
  const navigator = useNavigation();
  const isFocused = useIsFocused();
  const [records, setRecords] = useState<FullAttendanceRecord[]>([]);
  const [counter, setCounter] = useState(0);
  const [addRecordModalVisible, setAddRecordModalVisible] = useState(false);

  const onStatusChange = () => {
    setCounter(counter + 1);
  };

  useEffect(() => {
    if (!isFocused) return;
    getFullRecordsOfDate(db, timestamp, [], false)
      .then((records) => {
        setRecords(records);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [isFocused, counter]);

  useEffect(() => {
    const backHandler = () => {
      onClose();
      return true;
    };

    navigator.setOptions({
      headerTitle: () => null,
      headerLeft() {
        return (
          <Pressable
            onPress={onClose}
            android_ripple={{ color: 'lightgray' }}
            style={{
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

  useLayoutEffect(() => {
    navigator.setOptions({
      headerRight() {
        return (
          <Pressable
            onPress={() => setAddRecordModalVisible(true)}
            android_ripple={{ color: 'lightgray' }}
            style={{
              marginRight: 10
            }}
          >
            <Icon name="add" size={24} color="royalblue" />
          </Pressable>
        );
      }
    });
  }, []);

  const handleAddRecord = (updated: boolean) => {
    setAddRecordModalVisible(false);
    if (updated) setCounter(counter + 1);
  };

  return (
    <Animated.ScrollView style={{
      height: '100%'
    }} entering={SlideInRight.duration(200)}>
      <AddExtraClassModal
        visible={addRecordModalVisible}
        subjects={subjects}
        addAtDayTimestamp={timestamp}
        lastCell={records.length > 0 ? {
          startTime: epochStartTimeToStartTime(records[records.length - 1].startTimeMinsSinceEpoch),
          duration: records[records.length - 1].durationMins
        } : null}
        onClose={handleAddRecord}
      />

      <Text style={{
        padding: 20,
        paddingBottom: 0,
        fontSize: 16,
      }}>
        {displayDate(timestamp)}
      </Text>

      <View style={{
        padding: 10
      }}>
        {records.map((record, i) => (
          <SubjectRecord
            onStatusChange={onStatusChange}
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
    </Animated.ScrollView>
  );
}