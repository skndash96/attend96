import { days } from '@/lib/constants';
import React from 'react'
import { Dimensions, Text, TouchableOpacity } from 'react-native'

const screenWidth = Dimensions.get('screen').width;

export default function DayCell({
  dayIdx,
  handleEdit
}: {
  dayIdx: number,
  handleEdit: (i: number) => void
}) {
  return (
    <TouchableOpacity activeOpacity={0.4} onPress={() => handleEdit(dayIdx)} style={{
      width: screenWidth / 7,
      height: 40,
      justifyContent: 'center'
    }}>
      <Text style={{
        textAlign: 'center'
      }}>
        {days[dayIdx]}
      </Text>
    </TouchableOpacity>
  )
}
