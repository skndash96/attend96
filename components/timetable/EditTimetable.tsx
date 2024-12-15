import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
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
import { getAllSlots, Slot } from '@/utils/slots'

export default function EditTimetable({
  setVisible,
  updateTimetable,
  slots,
  timetable,
}: {
  setVisible: (b: boolean) => void,
  slots: Slot[],
  timetable: (FullCell | null)[][],
  updateTimetable: () => void,
}) {
  const db = useSQLiteContext();
  const navigator = useNavigation();
  const [editing, setEditing] = useState(1);
  const [selected, setSelected] = useState<(number)[]>([]); // selected slot index

  interface AddCellModalData {
    slotIdx: number,
    visible: boolean
  }
  const [addCellModalData, setAddCellModalData] = useState<AddCellModalData>({
    visible: false,
    slotIdx: -1
  });

  const handleDragEnd = useCallback((data: (FullCell | null)[]) => {
    orderCellsIdx(db, data)
      .then(() => updateTimetable())
      .catch(error => console.error(error));
  }, []);

  const handleClick = (slotIndex: number) => {
    if (selected.length === 0) return;
    else handleLongPress(slotIndex);
  };

  const handleLongPress = (slotIndex: number) => {
    const newSelected = [...selected];

    const idx = newSelected.indexOf(slotIndex);

    if (idx === -1) newSelected.push(slotIndex);
    else {
      newSelected.splice(idx, 1);
    }

    setSelected(newSelected);
  };

  const handleClose = async (subjectId: number|null, slotIdx: number) => {
    if (subjectId !== null) {
      await addCell(db, {
        idx: slotIdx ?? timetable[editing].length,
        day: editing,
        subjectId
      })
        .then(() => {
          updateTimetable();
        })
        .catch(error => {
          console.error(error);
        });
    }

    setAddCellModalData(p => ({
      slotIdx: -1,
      visible: false
    }));
    setSelected([]);
  };

  const handleDelete = () => {
    const toDelete = selected.filter(s => timetable[editing][s] !== null);

    deleteCells(db, toDelete.map(s => timetable[editing][s]!.id))
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
            }} onPress={() => setAddCellModalData({
              visible: true,
              slotIdx: selected[0]
            })} style={{
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
        <AddTimetableCellModal {...addCellModalData} onClose={handleClose} />

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
          <EditCell
            slots={slots}
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
    </View>
  )
}
