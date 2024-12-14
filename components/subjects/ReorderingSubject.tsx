import React from 'react'
import { Pressable, Text, TouchableOpacity, View } from 'react-native'
import Icon from '../Icon'

export default function ReorderingSubject({
  item,
  isActive,
  drag
}: {
  item: any,
  isActive: boolean,
  drag: () => void
}) {
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
      backgroundColor: isActive ? "lightblue" : "transparent",
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

      <Text>
        {item.shortName} - {item.name}
      </Text>
    </View>
  )
}
