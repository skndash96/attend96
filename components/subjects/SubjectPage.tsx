import { useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { BackHandler, Pressable, ScrollView, Text, View } from "react-native";
import Icon from "../Icon";
import { FullAttendanceRecord, getGroupedRecordsOfSubject } from "@/utils/records";
import { useSQLiteContext } from "expo-sqlite";
import SubjectRecord from "../home/SubjectRecord";
import { displayDate, displayTimeSinceEpoch, epochStartTimeToStartTime } from "@/utils/functions";
import Animated, { SlideInRight } from "react-native-reanimated";
import AddExtraClassModal from "../home/AddExtraClassModal";
import { Subject } from "@/utils/subjects";
import { useIsFocused } from "@react-navigation/native";
import SubjectRecordMinimal from "./SubjectRecordMinimal";

export default function SubjectPage({
  subject,
  onClose
}: {
  subject: Subject,
  onClose: () => void
}) {
  const db = useSQLiteContext();
  const [counter, setCounter] = useState(0);
  const [groupedRecords, setGroupedRecords] = useState<FullAttendanceRecord[][]>([]); //grouped by date
  const [editing, setEditing] = useState(false);
  const navigator = useNavigation();

  useLayoutEffect(() => {
    if (editing) {
      navigator.setOptions({
        headerRight() {
          return (
            <Pressable
              onPress={() => {
                setEditing(false);
              }}
              android_ripple={{ color: 'lightgray' }}
              style={{
                marginRight: 10,
                padding: 5
              }}
            >
              <Text style={{
                color: "royalblue"
              }}>
                Done
              </Text>
            </Pressable>
          );
        }
      });
    } else {
      navigator.setOptions({
        headerRight() {
          return (
            <Pressable
              onPress={() => {
                setEditing(true);
              }}
              android_ripple={{ color: 'lightgray' }}
              style={{
                marginRight: 10,
                padding: 5
              }}
            >
              <Icon name="pen" family='fa6' size={16} color="royalblue" />
            </Pressable>
          );
        }
      })
    }
  }, [editing]);

  useEffect(() => {
    getGroupedRecordsOfSubject(db, subject.id)
      .then(groupedRecords => {
        setGroupedRecords(groupedRecords);
      })
      .catch(error => console.error(error));
  }, [counter]);

  useEffect(() => {
    const backHandler = () => {
      onClose();
      return true;
    };

    navigator.setOptions({
      headerTitle: () => {
        return (subject.name);
      },
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

  const handleStatusChange = () => {
    setCounter(c => c + 1);
  };

  return (
    <Animated.ScrollView style={{
      height: '100%',
      padding: 10
    }} entering={SlideInRight.duration(200)}>
      {groupedRecords.length === 0 && (
        <Text style={{
          textAlign: "center",
          marginTop: 20
        }}>
          No records found for this subject
        </Text>
      )}
      {groupedRecords.map(records => (
        <View style={{
          marginBottom: 20
        }} key={records[0].startTimeMinsSinceEpoch}>
          <Text style={{
          }}>
            {displayDate(records[0].startTimeMinsSinceEpoch * 60 * 1000)}
          </Text>

          <View style={{
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            gap: 10
          }}>
            {records.map(record => (
              <SubjectRecordMinimal
                key={`${record.id}-${(record.status ?? 2)+1}`}
                subject={subject}
                record={record}
                editing={editing}
                onStatusChange={handleStatusChange}
              />
            ))}
          </View>
        </View>
      ))}
    </Animated.ScrollView>
  );
}