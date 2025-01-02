import React, { useState } from 'react'
import { FlatList, Modal, Pressable, Text, View } from 'react-native'
import SlideUpView from '../SlideUpView'
import { FullCell } from '@/utils/timetable';
import { Subject } from '@/utils/subjects';
import Icon from '../Icon';
import { TimerPicker } from 'react-native-timer-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { checkIntervals, startTimeToEpochStartTime, Time, toTime } from '@/utils/functions';
import * as Haptics from 'expo-haptics';
import { FullAttendanceRecord, insertRecord } from '@/utils/records';
import { useSQLiteContext } from 'expo-sqlite';

export default function AddExtraClassModal({
  subjects,
  visible,
  onClose,
  lastCell,
  addAtDayTimestamp
}: {
  subjects: Subject[],
  visible: boolean,
  onClose: (added: boolean) => void,
  lastCell: {
    startTime: number,
    duration: number,
  } | null,
  addAtDayTimestamp: number
}) {
  const db = useSQLiteContext();

  const [page, setPage] = useState(0);

  const freeSlot = {
    id: -1,
    idx: -1,
    name: "Free Slot",
    shortName: "Free Slot"
  };

  const initialStartTime = toTime(lastCell !== null ? lastCell.startTime + lastCell.duration : 510); //8:30am
  const initialDuration = toTime(lastCell !== null ? lastCell.duration : 50);

  const [subject, setSubject] = useState<Subject>(freeSlot);
  const [startTime, setStartTime] = useState<Time>(initialStartTime);
  const [duration, setDuration] = useState<Time>(initialDuration);

  const handleAdd = () => {
    //TODO check overlapping intervals

    insertRecord(db, {
      subjectId: subject.id === -1 ? null : subject.id,
      isExtra: true,
      durationMins: duration.hours * 60 + duration.minutes,
      startTimeMinsSinceEpoch: startTimeToEpochStartTime(startTime.hours * 60 + startTime.minutes, addAtDayTimestamp),
      status: null
    })
      .catch(console.error)
      .finally(() => {
        setPage(0);
        onClose(true);
      });
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={() => {
        setPage(0);
        onClose(false);
    }}>
      <View style={{
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
      }}>
        <SlideUpView style={{
          width: '80%',
          backgroundColor: 'white',
          borderRadius: 10,
          padding: 20
        }}>
          {page === 0 && (
            <>
              <Text style={{}}>
                Choose Extra Class
              </Text>

              <FlatList
                data={[freeSlot, ...subjects]}
                style={{
                  height: 250,
                  marginTop: 10,
                  borderRadius: 10,
                  backgroundColor: '#f1f1f1'
                }}
                renderItem={({ item }) => (
                  <Pressable android_ripple={{
                    color: "lightgray"
                  }} onPress={() => setSubject(item)} style={{
                    padding: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: "lightgray"
                  }}>
                    <Text>
                      {item.id === subject.id && (
                        <>
                          <Icon name="check" family='fa6' size={14} />
                          <Text>   </Text>
                        </>
                      )}
                      {item.shortName} - {item.name}
                    </Text>
                  </Pressable>
                )}
              />
            </>
          )}

          {page === 1 && (
            <>
              <Text>
                Choose Class Timing
              </Text>

              <View style={{
                padding: 10,
                marginTop: 10
              }}>
                <Text style={{
                  fontWeight: 'bold',
                  marginBottom: 5,
                  fontSize: 15
                }}>
                  Start Time
                </Text>
                <TimerPicker
                  LinearGradient={LinearGradient}
                  Haptics={Haptics}
                  use12HourPicker
                  hideSeconds
                  onDurationChange={d => setStartTime(d)}
                  initialValue={initialStartTime}
                  styles={{
                    pickerContainer: {
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      borderRadius: 20,
                    },
                    pickerGradientOverlay: {
                      height: '40%'
                    },
                    pickerAmPmLabel: {
                      fontSize: 16,
                    },
                    pickerAmPmContainer: {
                      marginLeft: 10,
                      paddingLeft: 10
                    },
                    pickerLabel: {
                      fontSize: 16
                    },
                    pickerItem: {
                      fontSize: 20
                    }
                  }
                  } />
              </View>
              <View style={{
                padding: 10
              }}>
                <Text style={{
                  fontWeight: 'bold',
                  marginBottom: 5,
                  fontSize: 15
                }}>
                  Duration
                </Text>
                <TimerPicker
                  LinearGradient={LinearGradient}
                  Haptics={Haptics}
                  hideSeconds
                  onDurationChange={d => setDuration(d)}
                  initialValue={initialDuration} styles={{
                    pickerContainer: {
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      borderRadius: 20,
                    },
                    pickerGradientOverlay: {
                      height: '40%'
                    },
                    pickerAmPmLabel: {
                      fontSize: 16,
                    },
                    pickerAmPmContainer: {
                      marginLeft: 10,
                      paddingLeft: 10
                    },
                    pickerLabel: {
                      fontSize: 16
                    },
                    pickerItem: {
                      fontSize: 20
                    }
                  }}
                />
              </View>
            </>
          )}

          <View style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: 10
          }}>
            {page === 0 && (
              <Pressable onPress={() => setPage(1)} style={{
                padding: 10,
                backgroundColor: 'lightgray',
                borderRadius: 10,
                marginLeft: 'auto'
              }}>
                <Text>
                  Next
                </Text>
              </Pressable>
            )}

            {page === 1 && (
              <>
                <Pressable onPress={() => setPage(0)} style={{
                  padding: 10,
                  backgroundColor: 'lightgray',
                  borderRadius: 10
                }}>
                  <Text>
                    Previous
                  </Text>
                </Pressable>

                <Pressable onPress={handleAdd} style={{
                  padding: 10,
                  backgroundColor: 'royalblue',
                  borderRadius: 10,
                  marginLeft: 'auto'
                }}>
                  <Text style={{
                    color: 'white'
                  }}>
                    Add Class
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </SlideUpView>
      </View>
    </Modal >
  )
}
