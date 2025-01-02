import { displayTime, displayTimeSinceEpoch, getSubjectAttendanceInfo } from '@/utils/functions'
import { FullAttendanceRecord, Status, updateRecordStatus } from '@/utils/records'
import { useSQLiteContext } from 'expo-sqlite'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Icon from '../Icon'
import { getCriteria } from '@/utils/misc'

export default function SubjectRecord({
  record,
  onStatusChange
}: {
  record: FullAttendanceRecord,
  onStatusChange: () => void
}) {
  const db = useSQLiteContext();
  const criteria = getCriteria();
  const { ratio, text, color } = getSubjectAttendanceInfo({
    total: record.subjectTotal ?? 0,
    present: record.subjectPresent ?? 0,
    off: record.subjectOff ?? 0
  }, criteria);

  const handleStatusChange = (status: Status) => {
    updateRecordStatus(db, record, status === record.status ? null : status)
      .then(() => {
        onStatusChange();
        console.log("Updated", record.id, status);
      })
      .catch(console.error);
  };

  return (
    <View style={{
      padding: 10,
      borderWidth: 1,
      borderRadius: 10,
      margin: 10,
      marginBottom: 5,
      borderColor: "lightgray",
      opacity: record.subjectId === null ? 0.5 : 1,
    }}>
      <View style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
      }}>
        <View style={{
          marginRight: 10,
          padding: 10,
          backgroundColor: '#e0e0e0',
          borderRadius: 100,
          width: 60,
          height: 60
        }}>
          <Text style={{
            fontSize: 14,
            textAlign: "center",
            marginTop: -4,
            paddingBottom: 2,
            marginBottom: 2,
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
            fontSize: 16
          }}>
            {record.subjectName}
          </Text>

          <Text style={{
            marginTop: 2,
            fontSize: 12
          }}>
            {displayTimeSinceEpoch(record.startTimeMinsSinceEpoch)} - {displayTimeSinceEpoch(record.startTimeMinsSinceEpoch + record.durationMins)}
          </Text>
        </View>
      </View>

      <View style={{
        marginTop: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
      }}>
        <Text style={{
          fontSize: 12,
          color: '#666'
        }}>
          {text}
        </Text>

        {record.subjectId && (
          <View style={{
            display: "flex",
            flexDirection: "row",
            gap: 20
          }}>
            <TouchableOpacity onPress={() => handleStatusChange(0)} style={{
              width: 24,
              height: 24,
              borderRadius: 20,
              backgroundColor: record.status === 0 ? "orange" : "lightgray",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <Icon name="minus" family='ad' size={20} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleStatusChange(-1)} style={{
              width: 24,
              height: 24,
              borderRadius: 20,
              backgroundColor: record.status === -1 ? "coral" : "lightgray",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <Icon name="close" family='ad' size={20} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleStatusChange(1)} style={{
              width: 24,
              height: 24,
              borderRadius: 20,
              backgroundColor: record.status === 1 ? "lightgreen" : "lightgray",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <Icon name="check" family='ad' size={20} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  )
}
