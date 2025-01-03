import React from 'react'
import { Text, View } from 'react-native'
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { displayDate } from '@/utils/functions';

export default function Header(props: BottomTabHeaderProps) {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);

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
              : (
                <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold'
                  }}>
                    A96
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    marginLeft: 10,
                    marginRight: 10
                  }}>
                    •
                  </Text>
                  <Text style={{
                    fontSize: 14
                  }}>
                    {displayDate(Date.now())}
                  </Text>
                </View>
              )
          }
        </Text>
      </View>

      {props.options.headerRight && props.options.headerRight({
        canGoBack: props.navigation.canGoBack(),
      })}
    </View>
  )
}
