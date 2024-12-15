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
  slots,
  slotIdx,
  drag
}: {
  item: FullCell | null,
  isSelected: boolean,
  isActive: boolean,
  slots: Slot[],
  slotIdx: number,
  handleClick: (slotIdx: number) => void,
  handleLongPress: (slotIdx: number) => void,
  drag: () => void
}) {
  const db = useSQLiteContext();
  const slot = slots[slotIdx ?? item?.idx ?? 0];

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
      }} onPress={() => handleClick(slotIdx)} onLongPress={() => handleLongPress(slotIdx)} style={{
        flex: 1,
        padding: 15,
        overflow: 'hidden',
        opacity: item ? 1 : 0.5
      }}>
        <Text style={{
          fontWeight: 'bold',
          marginBottom: 5
        }}>
          {item?.subjectName || "Empty"}
        </Text>
        <Text>
          Slot {item ? item.idx + 1 : slotIdx ? slotIdx + 1 : ''} {slot && `(${displayTime(slot.startTime)} - ${displayTime(slot.startTime + slot.duration)})`}
        </Text>
      </Pressable>
    </View>
  )
}
