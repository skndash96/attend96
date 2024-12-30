import { displayTime, displayTimeSinceEpoch } from '@/utils/functions'
import { FullAttendanceRecord, Status, updateRecordStatus } from '@/utils/records'
import { Slot } from '@/utils/slots'
import { useSQLiteContext } from 'expo-sqlite'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Icon from '../Icon'

export default function SubjectRecord({
  record,
  slot,
  onStatusChange
}: {
  record: FullAttendanceRecord,
  slot: Omit<Omit<Slot, 'id'>, 'idx'>,
  onStatusChange: () => void
}) {
  const db = useSQLiteContext();

  const handleStatusChange = (status: Status) => {
    updateRecordStatus(db, record.id, status === record.status ? null : status)
      .then(() => {
        onStatusChange();
        console.log("Updated", record.id, status);
      })
      .catch(console.error);
  };

  return (
    <View style={{
      margin: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: "lightgray",
      borderRadius: 10,
      opacity: record.subjectId === null ? 0.5 : 1
    }}>
      <Text style={{
        fontWeight: "bold"
      }}>
        {record?.subjectName || "Free Slot"}
      </Text>

      <View style={{
        marginTop: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
      }}>
        <View>
          <Text>
            {record ? (
              `${displayTimeSinceEpoch(record.startTimeMinsSinceEpoch)} - ${displayTimeSinceEpoch(record.startTimeMinsSinceEpoch + record.durationMins)}`
            ) : (
              `${displayTime(slot.startTime)} - ${displayTime(slot.startTime + slot.duration)}`
            )}
          </Text>
        </View>

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
