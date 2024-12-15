import React, { useLayoutEffect, useState } from 'react'
import { Pressable, Text, TouchableOpacity, View } from 'react-native'
import { ScaleDecorator } from 'react-native-draggable-flatlist'
import Icon from '../Icon'
import { getSlotByIdx, Slot } from '@/utils/slots'
import { FullCell } from '@/utils/timetable'
import { useSQLiteContext } from 'expo-sqlite'
import { displayTime } from '@/utils/functions'

export default function EditCell({
  item,
  isSelected,
  isActive,
  handleClick,
  handleLongPress,
  drag
}: {
  item: FullCell,
  isSelected: boolean,
  isActive: boolean,
  handleClick: (itemId: number) => void,
  handleLongPress: (itemId: number) => void,
  drag: () => void
}) {
  const db = useSQLiteContext();
  const [slot, setSlot] = useState<Slot|null>(null);

  useLayoutEffect(() => {
    getSlotByIdx(db, item.idx)
    .then(s => setSlot(s))
    .catch(console.error);
  }, []);

  return (
    <View style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: "lightgray",
      transform: [{
        scale: isActive ? 1.05 : 1
      }],
      boxShadow: isActive ? "0px 0px 10px rgba(0,0,0,0.1)" : "none",
      backgroundColor: isActive || isSelected ? "lightblue" : "transparent",
    }}>
      <TouchableOpacity
        onLongPress={drag}
        delayLongPress={200}
        disabled={isActive}
        style={{
          padding: 10,
          marginLeft: 10,
          marginRight: 10,
          height: 50,
        }}
      >
        <Icon name="reorder-three" size={24} />
      </TouchableOpacity>

      <Pressable android_ripple={{
        color: 'gray'
      }} onPress={() => handleClick(item.id)} onLongPress={() => handleLongPress(item.id)} style={{
        flex: 1,
        padding: 15,
        overflow: 'hidden'
      }}>
        <Text style={{
          fontWeight: 'bold',
          marginBottom: 5
        }}>
          {item.subjectName}
        </Text>
        <Text>
          {slot ? `${displayTime(slot.startTime)} - ${displayTime(slot.startTime + slot.duration)}` : `Slot ${item.idx+1}`}
        </Text>
      </Pressable>
    </View>
  )
}
