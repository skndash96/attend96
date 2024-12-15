import Cell from "@/components/timetable/Cell";
import { days } from "@/lib/constants";
import { FullCell, getTimetable } from "@/utils/timetable";
import { useNavigation } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import EditSlots from "@/components/timetable/EditSlots";
import EditTimetable from "@/components/timetable/EditTimetable";
import { getAllSlots, Slot } from "@/utils/slots";
import { displayTime } from "@/utils/functions";

const screenWidth = Dimensions.get('screen').width;

export default function Timetable() {
  const db = useSQLiteContext();
  const navigator = useNavigation();

  const [timetable, setTimetable] = useState<(FullCell | null)[][]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [counter, setCounter] = useState(0);
  const [editing, setEditing] = useState(0); //0 for no, 1 for timetable, 2 for slots

  const timetableRowCount = useMemo(() => {
    if (timetable.length === 0) return 0;
    else return Math.max(...timetable.map(tt => tt.length));
  }, [timetable]);

  useEffect(() => {
    getAllSlots(db)
      .then(slots => {
        setSlots(slots);
      })
      .catch(console.error);
    getTimetable(db)
      .then(tt => {
        setTimetable(tt);
      })
      .catch(console.error);
  }, [counter]);

  useLayoutEffect(() => {
    if (editing === 0) {
      navigator.setOptions({
        headerRight: () => (
          <Pressable onPress={() => setEditing(1)} android_ripple={{
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
  }, [editing]);

  if (editing > 0) {
    return (
      <View style={{
        flex: 1
      }}>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 10,
          margin: 10
        }}>
          <Pressable onPress={() => setEditing(1)} style={{
            flex: 1,
            padding: 10,
            borderRadius: 20,
            borderWidth: 1,
            backgroundColor: 'white',
            borderColor: editing === 1 ? 'royalblue' : 'transparent',
          }}>
            <Text style={{
              textAlign: 'center',
              color: editing === 1 ? 'royalblue' : 'black'
            }}>
              Timetable
            </Text>
          </Pressable>
          <Pressable onPress={() => setEditing(2)} style={{
            flex: 1,
            padding: 10,
            borderRadius: 20,
            borderWidth: 1,
            backgroundColor: 'white',
            borderColor: editing === 2 ? 'royalblue' : 'transparent',
          }}>
            <Text style={{
              textAlign: 'center',
              color: editing === 2 ? 'royalblue' : 'black'
            }}>
              Slots
            </Text>
          </Pressable>
        </View>

        {editing === 1 ? (
          <EditTimetable
            slots={slots}
            setVisible={(isOpen: boolean) => setEditing(isOpen ? 1 : 0)}
            timetable={timetable}
            updateTimetable={() => setCounter(c => c + 1)}
          />
        ) : (
          <EditSlots
            setVisible={(isOpen: boolean) => setEditing(isOpen ? 2 : 0)}
            updateTimetable={() => setCounter(c => c + 1)}
          />
        )}
      </View>
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
        paddingLeft: 38,
        marginBottom: 5
      }}>
        {days.slice(1).concat(days[0]).map((day, i) => (
          <Text style={{
            width: screenWidth / 7 - 6,
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
        overflow: "visible",
        paddingLeft: 38,
        position: 'relative'
      }}>
        {new Array(timetableRowCount).fill(0).map((_, i) => (
          <View key={i} style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
          }}>
            <Text style={{
              fontSize: 12,
              position: 'absolute',
              left: -15,
              zIndex: 1,
              transformOrigin: 'left',
              transform: [{ rotate: '-90deg' }, { translateX: '-50%' }]
            }}>
              {slots.length > i ? displayTime(slots[i].startTime) : `Slot ${i+1}`}
            </Text>
            {[1, 2, 3, 4, 5, 6, 0].map(j => (
              <Cell
                key={j}
                shortName={timetable[j]?.[i]?.subjectShortName || ""}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
