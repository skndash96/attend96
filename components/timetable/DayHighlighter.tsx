import React from 'react'
import { Dimensions, View } from 'react-native'

const screenWidth = Dimensions.get('screen').width;

export default function DayHighlighter({
  editing
}: {
  editing: number
}) {
  return (
    <View style={{
      width: screenWidth / 7,
      height: 40,
      backgroundColor: "lightgray",
      position: 'absolute',
      left: (editing - 1 + 7) % 7 * screenWidth / 7,
      borderRadius: 10,
      borderBottomColor: "royalblue",
      borderBottomWidth: 3,
      top: 0
    }} />
  )
}
