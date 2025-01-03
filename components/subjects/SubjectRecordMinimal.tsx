import { View, Text, Pressable, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { AttendanceRecord, Status, updateRecordStatus } from '@/utils/records'
import { Subject, updateSubjectAttendance } from '@/utils/subjects'
import { displayDate, displayTimeSinceEpoch } from '@/utils/functions'
import { useNavigation } from 'expo-router'
import Icon from '../Icon'
import { useSQLiteContext } from 'expo-sqlite'

export default function SubjectRecordMinimal({
  subject,
  record,
  editing,
  onStatusChange
}: {
  subject: Subject,
  record: AttendanceRecord,
  editing: boolean,
  onStatusChange: () => void
}) {
  const db = useSQLiteContext();
  
  const labels = ["Absent", "Off", "Present", "Not Marked"];
  const colors = ["salmon", "orange", "mediumseagreen", "black"];
  const color = colors[(record.status ?? 2) + 1];
  const label = labels[(record.status ?? 2) + 1];

  const handleStatusChange = (status: Status) => {
    updateRecordStatus(db, record, status === record.status ? null : status)
    .then(() => {
      onStatusChange();
    })
    .catch(console.error);
  };

  return (
    <View key={record.id} style={{
      padding: 10,
      borderWidth: 1,
      borderColor: "lightgray",
      borderRadius: 10,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <View style={{
      }}>
        <Text style={{
          fontSize: 14
        }}>
          {displayTimeSinceEpoch(record.startTimeMinsSinceEpoch)}
        </Text>
      </View>
      {editing ? (
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
            backgroundColor: record.status === 1 ? "mediumseagreen" : "lightgray",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <Icon name="check" family='ad' size={20} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{
          padding: 5,
          backgroundColor: color,
          borderRadius: 5
        }}>
          <Text style={{
            color: "white"
          }}>
            {label}
          </Text>
        </View>
      )}
    </View >
  );
}