import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { BackHandler, Pressable, Text, View } from 'react-native'
import AddTimetableCellModal from './AddTimetableCellModal'
import DayHighlighter from './DayHighlighter'
import DayCell from './DayCell'
import DraggableFlatList from 'react-native-draggable-flatlist'
import { deleteCells, FullCell, orderCellsIdx } from '@/utils/timetable'
import EditCell from './EditCell'
import { useSQLiteContext } from 'expo-sqlite'
import { useNavigation } from 'expo-router'
import Icon from '../Icon'
import { Subject } from '@/utils/subjects'
import * as Haptics from 'expo-haptics'

export default function EditTimetable({
  setVisible,
  updateTimetable,
  timetable,
  subjects
}: {
  setVisible: (b: boolean) => void,
  timetable: FullCell[][],
  subjects: Subject[],
  updateTimetable: () => void,
}) {
  const db = useSQLiteContext();
  const navigator = useNavigation();
  const [editingDayIdx, setEditingDayIdx] = useState(1);
  const [selected, setSelected] = useState<(number)[]>([]); // selected slot index

  const [addCellModalVisible, setAddCellModalVisible] = useState(false);

  const handleClose = (updated: boolean) => {
    setAddCellModalVisible(false);
    setSelected([]);

    if (updated) updateTimetable();
  };

  const handleDragEnd = useCallback((data: FullCell[]) => {
    orderCellsIdx(db, data)
      .then(() => updateTimetable())
      .catch(error => console.error(error));
  }, []);

  const handleClick = (slotIndex: number) => {
    if (selected.length === 0) return;
    else handleLongPress(slotIndex);
  };

  const handleLongPress = (slotIndex: number) => {
    if (selected.length === 0) {
      console.log('Haptic');
      Haptics.selectionAsync();
    };
    
    const newSelected = [...selected];


    const idx = newSelected.indexOf(slotIndex);

    if (idx === -1) newSelected.push(slotIndex);
    else {
      newSelected.splice(idx, 1);
    }

    setSelected(newSelected);
  };

  const handleDelete = () => {
    deleteCells(db, selected.map(s => timetable[editingDayIdx][s].id))
      .then(() => {
        setSelected([]);
        updateTimetable();
      })
      .catch(console.error);
  };

  useLayoutEffect(() => {
    const backPressHandler = () => {
      if (selected.length > 0) {
        setSelected([]);
      } else {
        setVisible(false);
      }

      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", backPressHandler);

    return () => BackHandler.removeEventListener("hardwareBackPress", backPressHandler);
  }, [selected, editingDayIdx]);

  useLayoutEffect(() => {
    if (selected.length === 0) {
      navigator.setOptions({
        headerLeft: null,
        headerTitle: null,
        headerRight: () => (
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Pressable android_ripple={{
              color: 'gray'
            }} onPress={() => setVisible(false)} style={{
              padding: 10,
            }}>
              <Text style={{
                color: 'royalblue'
              }}>
                Done
              </Text>
            </Pressable>
          </View>
        )
      });
      return;
    }

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
          {selected.length === 1 && (
            <Pressable android_ripple={{
              borderless: true
            }} onPress={() => setAddCellModalVisible(true)} style={{
              padding: 10
            }}>
              <Icon name="pencil" size={20} color='royalblue' />
            </Pressable>
          )}
          <Pressable android_ripple={{
            borderless: true
          }} onPress={() => handleDelete()} style={{
            padding: 10,
            marginRight: 10
          }}>
            <Text style={{
              color: 'red'
            }}>
              Delete
            </Text>
          </Pressable>
        </View>
      )
    });
  }, [selected]);

  return (
    <View>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 10
      }}>
        <AddTimetableCellModal
          subjects={subjects}
          visible={addCellModalVisible}
          editCell={selected.length === 1 ? timetable[editingDayIdx][selected[0]] : null}
          cells={timetable[editingDayIdx]}
          onClose={handleClose}
          dayIdx={editingDayIdx}
        />

        <DayHighlighter editingDayIdx={editingDayIdx} />

        {[1, 2, 3, 4, 5, 6, 0].map((i) => (
          <DayCell
            key={i}
            dayIdx={i}
            handleEdit={() => setEditingDayIdx(i)}
          />
        ))}
      </View>

      <DraggableFlatList
        activationDistance={0}
        scrollEnabled={false}
        data={timetable[editingDayIdx]}
        renderItem={(props) => (
          <EditCell
            slotIdx={props.getIndex()!}
            handleLongPress={handleLongPress}
            handleClick={handleClick}
            isSelected={selected.includes(props.getIndex()!)}
            {...props}
          />
        )}
        keyExtractor={(item, idx) => `${item === null ? idx : `-${item.day}-${idx}`}`}
        onDragEnd={({ data }) => handleDragEnd(data)}
      />

      <View>
        <Pressable android_ripple={{
          color: 'gray'
        }} onPress={() => setAddCellModalVisible(true)} style={{
          padding: 10,
          margin: 10,
          borderRadius: 10,
          backgroundColor: 'lightgray'
        }}>
          <Text style={{
            textAlign: 'center'
          }}>
            Add Cell
          </Text>
        </Pressable>
      </View>
    </View>
  )
}
