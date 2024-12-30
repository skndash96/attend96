import React from 'react'
import { Dimensions, Text, View } from 'react-native'

const screenWidth = Dimensions.get('screen').width;

export default function Cell({
  shortName,
  highlight
}: {
  shortName: string,
  highlight?: boolean
}) {
  return (
    <View style={{
      width: screenWidth / 7 - 8,
      height: 72,
      borderRadius: 10,
      justifyContent: 'center',
      marginBottom: 2,
      backgroundColor: highlight ? "lightblue" : "lightgray"
    }}>
      <Text style={{
        textAlign: 'center',
        fontSize: 13
      }}>
        {shortName}
      </Text>
    </View>
  );
}