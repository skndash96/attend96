import { displayTime } from '@/utils/functions'
import { Slot } from '@/utils/slots'
import React from 'react'
import { Pressable, Text, View } from 'react-native'

export default function SlotComponent({
  item, handleClick, handleLongPress, isSelected
}: {
  item: Slot,
  handleClick: (id: number) => void,
  handleLongPress: (id: number) => void,
  isSelected: boolean
}) {
  return (
    <Pressable android_ripple={{
      color: 'lightgray'
    }} onPress={() => handleClick(item.id)} onLongPress={() => handleLongPress(item.id)} style={{
      padding: 20,
      backgroundColor: isSelected ? 'lightblue' : 'white',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: 'lightgray'
    }}>
      <Text style={{
        fontSize: 16
      }}>
        Slot - {item.idx + 1}
      </Text>
      <View style={{}}>
        <Text>
          {displayTime(item.startTime)} - {displayTime(item.startTime+item.duration)}
        </Text>
        <Text>
          ({item.duration} mins)
        </Text>
      </View>
    </Pressable>
  )
}

const printn = (n: number) => n.toString().padStart(2, '0');