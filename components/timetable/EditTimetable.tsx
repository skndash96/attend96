import React, { useCallback, useLayoutEffect, useState } from 'react'
import { BackHandler, Pressable, Text, View } from 'react-native'
import AddTimetableCellModal from './AddTimetableCellModal'
import DayHighlighter from './DayHighlighter'
import DayCell from './DayCell'
import DraggableFlatList from 'react-native-draggable-flatlist'
import { addCell, deleteCells, FullCell, orderCellsIdx } from '@/utils/timetable'
import EditCell from './EditCell'
import { useSQLiteContext } from 'expo-sqlite'
import { useNavigation } from 'expo-router'
import Icon from '../Icon'
import { Slot } from '@/utils/slots'

export default function EditTimetable({
  setVisible,
  updateTimetable,
  timetable,
}: {
  setVisible: (b: boolean) => void,
  timetable: FullCell[][],
  updateTimetable: () => void,
}) {
  const db = useSQLiteContext();
  const navigator = useNavigation();
  const [editing, setEditing] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [addCellModalVisible, setAddCellModalVisible] = useState(false);

  const handleDragEnd = useCallback((data: FullCell[]) => {
    orderCellsIdx(db, data)
      .then(() => updateTimetable())
      .catch(error => console.error(error));
  }, []);

  const handleClick = (itemId: number) => {
    if (selected.length === 0) return;
    else handleLongPress(itemId);
  };

  const handleLongPress = (itemId: number) => {
    const newAddSubjectModal = [...selected];

    const addSubjectModalIdx = newAddSubjectModal.indexOf(itemId);

    if (addSubjectModalIdx === -1) newAddSubjectModal.push(itemId);
    else {
      newAddSubjectModal.splice(addSubjectModalIdx, 1);
    }

    setSelected(newAddSubjectModal);
  };

  const handleClose = (itemId: number | null) => {
    if (itemId !== null) {
      addCell(db, {
        idx: timetable[editing].length,
        day: editing,
        subjectId: itemId
      })
        .then(() => {
          updateTimetable();
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          setAddCellModalVisible(false);
        });
    } else {
      setAddCellModalVisible(false);
    }
  };

  const handleDelete = () => {
    deleteCells(db, selected)
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
  }, [selected, editing]);

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
            }} onPress={() => setAddCellModalVisible(true)} style={{
              padding: 10,
            }}>
              <Icon color="royalblue" name="add" size={20} />
            </Pressable>
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
  }, [selected]);

  return (
    <View>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 10
      }}>
        {addCellModalVisible && (
          <AddTimetableCellModal visible={addCellModalVisible} onClose={handleClose} />
        )}

        <DayHighlighter editing={editing} />

        {[1, 2, 3, 4, 5, 6, 0].map((i) => (
          <DayCell
            key={i}
            dayIdx={i}
            handleEdit={() => setEditing(i)}
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
  )
}
