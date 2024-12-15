import { deleteSlots, getAllSlots, orderSlotsIdx, Slot } from '@/utils/slots';
import { FullCell } from '@/utils/timetable'
import { useSQLiteContext } from 'expo-sqlite';
import React, { useLayoutEffect, useMemo, useState } from 'react'
import { BackHandler, Pressable, ScrollView, Text, View } from 'react-native'
import SlotComponent from './SlotComponent';
import { useNavigation } from 'expo-router';
import Icon from '../Icon';
import AddSlotModal from './AddSlotModal';

export default function EditSlots({
  setVisible,
  updateTimetable
}: {
  setVisible: (b: boolean) => void,
  updateTimetable: () => void
}) {
  const navigator = useNavigation();
  const db = useSQLiteContext();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [addSlotModalVisible, setAddSlotModalVisible] = useState(false);
  const [editSlotId, setEditSlotId] = useState<number | null>(null);

  const handleDelete = () => {
    deleteSlots(db, selected)
      .then(() => {
        setSelected([]);
        updateTimetable()
      })
      .catch(console.error);
  };

  useLayoutEffect(() => {
    getAllSlots(db)
      .then(slots => {
        setSlots(slots)
      })
      .catch(console.error);

    BackHandler.addEventListener('hardwareBackPress', () => {
      if (selected.length === 0) {
        setVisible(false);
        return true;
      } else {
        setSelected([]);
        return true;
      }
    });

    if (selected.length === 0) {
      navigator.setOptions({
        headerTitle: null,
        headerLeft: null,
        headerRight: () => (
          <View style={{
            display: 'flex',
            flexDirection: 'row'
          }}>
            <Pressable onPress={() => {
              setEditSlotId(null);
              setAddSlotModalVisible(true)
            }} android_ripple={{
              color: 'lightgray'
            }} style={{
              padding: 10
            }}>
              <Icon name="add" size={20} color="royalblue" />
            </Pressable>

            <Pressable onPress={() => setVisible(false)} android_ripple={{
              color: 'lightgray'
            }} style={{
              padding: 10
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
    } else {
      navigator.setOptions({
        headerTitle: () => null,
        headerLeft: () => (
          <Pressable onPress={() => setSelected([])} android_ripple={{
            color: 'lightgray'
          }}>
            <Icon name="arrow-back" size={20} />
          </Pressable>
        ),
        headerRight: () => (
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            {selected.length === 1 && (
              <Pressable onPress={() => {
                setEditSlotId(selected[0]);
                setAddSlotModalVisible(true);
              }}
                android_ripple={{
                  color: 'lightgray'
                }} style={{
                  padding: 10
                }}>
                <Icon name="pencil" color='royalblue' size={20} />
              </Pressable>
            )}
            <Pressable onPress={handleDelete}
              android_ripple={{
                color: 'lightgray'
              }} style={{
                padding: 10
              }}>
              <Text style={{
                color: "red"
              }}>
                Delete
              </Text>
            </Pressable>
          </View>
        )
      });
    }
  }, [selected]);

  const handleModalClose = (added?: boolean) => {
    if (added) {
      setSelected([]);
    }

    updateTimetable();
    setAddSlotModalVisible(false);
  };

  const handleClick = (id: number) => {
    if (selected.length === 0) return;

    const newSelected = [...selected];

    const idx = newSelected.indexOf(id);
    if (idx === -1) newSelected.push(id);
    else newSelected.splice(idx, 1);

    setSelected(newSelected);
  };

  const handleLongPress = (id: number) => {
    if (selected.length === 0) {
      setSelected([id]);
    }
  };

  return (
    <View>
      <AddSlotModal
        slots={slots}
        editSlotId={editSlotId}
        visible={addSlotModalVisible}
        onClose={handleModalClose}
      />

      <ScrollView>
        {slots.map(slot => (
          <SlotComponent isSelected={selected.includes(slot.id)} handleClick={handleClick} handleLongPress={handleLongPress} key={slot.id} item={slot} />
        ))}
      </ScrollView>
    </View>
  )
}
