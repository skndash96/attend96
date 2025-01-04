import Cell from "@/components/timetable/Cell";
import { days } from "@/lib/constants";
import { FullCell, getTimetable } from "@/utils/timetable";
import { useNavigation } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import EditTimetable from "@/components/timetable/EditTimetable";
import { getSubjects, Subject } from "@/utils/subjects";
import { useIsFocused } from "@react-navigation/native";

const screenWidth = Dimensions.get('screen').width;

export default function Timetable() {
  const db = useSQLiteContext();
  const navigator = useNavigation();
  const currentDay = new Date().getDay();
  const isFocused = useIsFocused();

  const [timetable, setTimetable] = useState<FullCell[][]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [counter, setCounter] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const timetableRowCount = useMemo(() => {
    if (timetable.length === 0) return 0;
    else return Math.max(...timetable.map(tt => tt.length));
  }, [timetable]);

  useEffect(() => {
    if (!isFocused) return;
    
    getTimetable(db)
      .then(tt => {
        setTimetable(tt);
      })
      .catch(console.error);
    
    getSubjects(db)
      .then(subs => {
        setSubjects(subs);
      })
      .catch(console.error);
  }, [isFocused, counter]);

  useEffect(() => {
    if (!isEditing) {
      navigator.setOptions({
        headerRight: () => (
          <Pressable onPress={() => setIsEditing(true)} android_ripple={{
            color: 'lightgray'
          }} style={{
            padding: 10
          }}>
            <Text style={{
              color: 'royalblue'
            }}>
              Edit
            </Text>
          </Pressable>
        )
      });
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <EditTimetable
        subjects={subjects}
        setVisible={(isOpen: boolean) => setIsEditing(isOpen)}
        timetable={timetable}
        updateTimetable={() => setCounter(c => c + 1)}
      />
    );
  }

  return (
    <View style={{
      flex: 1,
      display: "flex",
      flexDirection: "column"
    }}>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        marginTop: 20,
        paddingLeft: 10,
        marginBottom: 5
      }}>
        {days.slice(1).concat(days[0]).map((day, i) => (
          <Text style={{
            width: screenWidth / 7 - 3,
            textAlign: 'center',
            fontWeight: 'bold'
          }} key={day}>
            {day}
          </Text>
        ))}
      </View>

      <ScrollView style={{
        flex: 1,
        paddingBottom: 20,
        padding: 10,
        overflow: "visible",
        position: 'relative'
      }}>
        {new Array(timetableRowCount).fill(0).map((_, i) => (
          <View key={i} style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
          }}>
            {[1, 2, 3, 4, 5, 6, 0].map(j => (
              <Cell
                key={j}
                highlight={j === currentDay}
                shortName={timetable[j]?.[i]?.subjectShortName || ""}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
