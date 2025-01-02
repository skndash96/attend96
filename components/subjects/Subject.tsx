import { getSubjectAttendanceInfo } from '@/utils/functions';
import { getCriteria } from '@/utils/misc';
import { Subject } from '@/utils/subjects'
import React from 'react'
import { Pressable, Text, View } from 'react-native'

export default function SubjectComponent({
  data,
  handleLongPress,
  handleClick,
  isSelected
}: {
  data: Omit<Subject, 'idx'>,
  isSelected: boolean,
  handleLongPress: (id: number) => void,
  handleClick: (id: number) => void
}) {
  const criteria = getCriteria();
  const { ratio, text, color } = getSubjectAttendanceInfo(data, criteria);

  return (
    <Pressable android_ripple={{
      color: "lightgray"
    }} onPress={() => handleClick(data.id)} onLongPress={() => handleLongPress(data.id)} style={{
      padding: 20,
      paddingLeft: 10,
      backgroundColor: isSelected ? "lightblue" : "white",
      borderBottomWidth: 1,
      borderColor: "lightgray",
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    }}>
      <View style={{
        marginRight: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 100,
        width: 60,
        height: 60
      }}>
        <Text style={{
          fontSize: 14,
          textAlign: "center",
          borderBottomWidth: 1,
          borderBottomColor: color,
          color
        }}>
          {ratio}
        </Text>

        <Text style={{
          textAlign: "center",
          color
        }}>
          {criteria}
        </Text>
      </View>

      <View>
        <Text style={{
          fontSize: 14,
          fontWeight: "bold"
        }}>
          {data.name}
        </Text>

        <Text style={{
          color: ratio >= criteria ? 'darkgray' : 'orangered',
          fontSize: 12,
        }}>
          {text}
        </Text>

        <View style={{
          marginTop: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between"
        }}>
          <View style={{
            display: "flex",
            flexDirection: "row"
          }}>
            <Text style={{
              fontSize: 12,
              opacity: .7
            }}> Attd:</Text>
            <Text style={{
              fontSize: 12,
              opacity: .9,
              fontWeight: 'bold'
            }}> {data.present} </Text>
          </View>
          <View style={{
            display: "flex",
            flexDirection: "row"
          }}>
            <Text style={{
              fontSize: 12,
              opacity: .7
            }}> Miss:</Text>
            <Text style={{
              fontSize: 12,
              opacity: .9,
              fontWeight: 'bold'
            }}> {data.total - data.present} </Text>
          </View>
          <View style={{
            display: "flex",
            flexDirection: "row"
          }}>
            <Text style={{
              fontSize: 12,
              opacity: .7
            }}> Off:</Text>
            <Text style={{
              fontSize: 12,
              opacity: .9,
              fontWeight: 'bold'
            }}> {data.off} </Text>
          </View>
          <View style={{
            display: "flex",
            flexDirection: "row"
          }}>
            <Text style={{
              fontSize: 12,
              opacity: .7
            }}> Total:</Text>
            <Text style={{
              fontSize: 12,
              opacity: .9,
              fontWeight: 'bold'
            }}> {data.total} </Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}
