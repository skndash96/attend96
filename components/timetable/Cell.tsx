import React from 'react'
import { Dimensions, Text, View } from 'react-native'

const screenWidth = Dimensions.get('screen').width;

export default function Cell({
  shortName
}: {
  shortName: string
}) {
  return (
    <View style={{
      width: screenWidth / 7 - 8,
      height: 72,
      borderRadius: 10,
      justifyContent: 'center',
      marginBottom: 2,
      backgroundColor: "lightgray"
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