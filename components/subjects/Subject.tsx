import { Subject } from '@/utils/subjects'
import React from 'react'
import { Pressable, Text, View } from 'react-native'

export default function SubjectComponent({
  data,
  handleLongPress,
  handleClick,
  isSelected
}: {
  data: Subject,
  isSelected: boolean,
  handleLongPress: (id: number) => void,
  handleClick: (id: number) => void
}) {
  return (
    <Pressable android_ripple={{
      color: "lightgray"
    }} onPress={() => handleClick(data.id)} onLongPress={() => handleLongPress(data.id)} style={{
      padding: 20,
      backgroundColor: isSelected ? "lightblue" : "white",
      borderBottomWidth: 1,
      borderBottomColor: "lightgray"
    }}>
      <Text>
        {data.shortName} - {data.name}
      </Text>
    </Pressable>
  )
}
