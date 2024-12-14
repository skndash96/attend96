import { FullAttendanceRecord } from '@/utils/records'
import React from 'react'
import { Text, View } from 'react-native'

export default function SubjectRecord({
  record
}: {
  record: FullAttendanceRecord
}) {
  return (
    <View style={{
      margin: 5,
      borderWidth: 1,
      borderColor: "lightgray",
      borderRadius: 10
    }}>
      <Text>
        {record.subjectShortName} - {record.subjectName}
      </Text>
    </View>
  )
}
