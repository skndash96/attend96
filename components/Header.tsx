import React from 'react'
import { Text, View } from 'react-native'
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';

export default function Header(props: BottomTabHeaderProps) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  return (
    <View style={{
      display: "flex",
      flexDirection: "row",
      backgroundColor: "white",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomColor: "lightgrey",
      borderBottomWidth: 1,
      width: "100%"
    }}>
      <View style={{
        display: "flex",
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 10
      }}>
        {props.options.headerLeft && props.options.headerLeft({})}

        <Text style={{
          fontSize: 18,
          fontFamily: "monospace"
        }}>
          {typeof props.options.headerTitle === "string"
            ? props.options.headerTitle
            : props.options.headerTitle
            ? props.options.headerTitle({ children: "" })
            : "Attend96"
        }
        </Text>
      </View>

      {props.options.headerRight && props.options.headerRight({
        canGoBack: props.navigation.canGoBack(),
      })}
    </View>
  )
}
