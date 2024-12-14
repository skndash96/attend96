import Icon from "@/components/Icon";
import AddTimetableCellModal from "@/components/timetable/AddTimetableCellModal";
import Cell from "@/components/timetable/Cell";
import DayCell from "@/components/timetable/DayCell";
import DayHighlighter from "@/components/timetable/DayHighlighter";
import EditCell from "@/components/timetable/EditCell";
import { days } from "@/lib/constants";
import { addCell, deleteCells, FullCell, getTimetable, orderCellsIdx } from "@/utils/timetable";
import { useNavigation } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { BackHandler, Dimensions, Pressable, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";

const screenWidth = Dimensions.get('screen').width;

export default function Timetable() {
  const db = useSQLiteContext();
  const navigator = useNavigation();
  //todo get this input from user
  const timing = ["8:30", "9:20", "10:30", "11:20", "2:00", "2:40"];

  const [timetable, setTimetable] = useState<FullCell[][]>([]);
  const [editing, setEditing] = useState(-1);
  const [counter, setCounter] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [visible, setVisible] = useState(false);

  const timetableRowCount = useMemo(() => {
    if (timetable.length === 0) return 0;
    else return Math.max(...timetable.map(tt => tt.length));
  }, [timetable]);

  const handleEdit = (i?: number) => {
    if (i !== undefined) {
      setEditing(i);
    } else {
      setEditing(prev => prev === -1 ? 1 : -1);
    }
  };

  const handleDelete = () => {
    deleteCells(db, selected)
      .then(() => {
        setSelected([]);
        setCounter(c => c + 1)
      })
      .catch(console.error);
  };

  useLayoutEffect(() => {
    if (selected.length > 0) {
      navigator.setOptions({
        headerLeft: () => (
          <Pressable android_ripple={{
            borderless: true
          }} onPress={() => setSelected([])} style={{
            marginRight: 10
          }}>
            <Icon name="arrow-back" size={20} />
          </Pressable>
        ),
        headerTitle: () => null,
        headerRight: () => (
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Pressable android_ripple={{
              borderless: true
            }} onPress={() => handleDelete()} style={{
              marginRight: 10
            }}>
              <Icon color="red" name="trash-bin" size={20} />
            </Pressable>
          </View>
        )
      });
    } else {
      navigator.setOptions({
        headerLeft: null,
        headerTitle: null,
        headerRight: () => (
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            {editing >= 0 && (
              <Pressable android_ripple={{
                color: 'gray'
              }} onPress={() => setVisible(true)} style={{
                padding: 10,
              }}>
                <Icon color="royalblue" name="add" size={20} />
              </Pressable>
            )}

            <Pressable android_ripple={{
              color: 'gray'
            }} onPress={() => handleEdit()} style={{
              padding: 10,
            }}>
              <Text style={{
                fontSize: 16,
                color: 'royalblue',
              }}>
                {editing >= 0 ? "Done" : "Edit"}
              </Text>
            </Pressable>
          </View>
        )
      });
    }
  }, [selected, editing]);

  useLayoutEffect(() => {
    const backPressHandler = () => {
      if (selected.length > 0) {
        setSelected([]);
        return true;
      }
      if (editing >= 0) {
        setEditing(-1);
        return true;
      }
      return false;
    };

    BackHandler.addEventListener("hardwareBackPress", backPressHandler);

    return () => BackHandler.removeEventListener("hardwareBackPress", backPressHandler);
  }, [selected, editing]);

  useEffect(() => {
    getTimetable(db)
      .then(tt => {
        setTimetable(tt);
      })
      .catch(console.error);
  }, [counter]);

  const handleDragEnd = useCallback((data: FullCell[]) => {
    orderCellsIdx(db, data)
      .then(() => setCounter(c => c + 1))
      .catch(error => console.error(error));
  }, [editing]);

  const handleClick = (itemId: number) => {
    if (selected.length === 0) return;
    else handleLongPress(itemId);
  };

  const handleLongPress = (itemId: number) => {
    const newaddSubjectModal = [...selected];

    const addSubjectModalIdx = newaddSubjectModal.indexOf(itemId);

    if (addSubjectModalIdx === -1) newaddSubjectModal.push(itemId);
    else {
      newaddSubjectModal.splice(addSubjectModalIdx, 1);
    }

    setSelected(newaddSubjectModal);
  };

  const handleClose = (itemId: number|null) => {
    if (itemId !== null) {
      addCell(db, {
        idx: timetable[editing].length,
        day: editing,
        subjectId: itemId
      })
      .then(() => {
        setCounter(c => c + 1);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setVisible(false);
      });
    } else {
      setVisible(false);
    }
  };

  if (editing >= 0) {
    return (
      <View style={{
        flex: 1
      }}>
        {visible && (
          <AddTimetableCellModal visible={visible} onClose={handleClose} />
        )}

        <View style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: 20,
        }}>
          <DayHighlighter editing={editing} />

          {[1, 2, 3, 4, 5, 6, 0].map((i) => (
            <DayCell
              key={i}
              dayIdx={i}
              handleEdit={handleEdit}
            />
          ))}
        </View>

        <DraggableFlatList
          activationDistance={0}
          scrollEnabled={false}
          data={timetable[editing]}
          renderItem={(props) => (
            <EditCell handleLongPress={handleLongPress} handleClick={handleClick} isSelected={selected.includes(props.item.id)} {...props} />
          )}
          keyExtractor={(item, idx) => `${item.id ? `${item.id}-${item.day}` : `-${item.day}-${idx}`}`}
          onDragEnd={({ data }) => handleDragEnd(data)}
        />
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
              {timing[i]} pm
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
