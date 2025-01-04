import { Subject } from '@/utils/subjects';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, Modal, Pressable } from 'react-native';
import SlideUpView from '../SlideUpView';
import { TimerPicker } from 'react-native-timer-picker';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { checkIntervals, Time, toTime } from '@/utils/functions';
import { addCell, Cell, updateCell } from '@/utils/timetable';
import { FlatList } from 'react-native-gesture-handler';
import Icon from '../Icon';
import Toast from 'react-native-simple-toast';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default function AddCellModalData({
  subjects, visible, onClose, editCell, cells, dayIdx
}: {
  subjects: Subject[];
  visible: boolean;
  onClose: (updated: boolean) => void;
  editCell: Cell | null;
  cells: Cell[],
  dayIdx: number;
}) {
  const db = useSQLiteContext();
  const lastCell = cells[cells.length - 1] ?? null;

  const initialStartTime = toTime(editCell !== null ? editCell.startTime : lastCell !== null ? lastCell.startTime + lastCell.duration : 510); //8:30am

  const initialDuration = toTime(editCell !== null ? editCell.duration : lastCell !== null ? lastCell.duration : 50);

  const freeSubject = {
    id: -1,
    idx: -1,
    shortName: 'Free',
    name: 'Empty Slot',
    total: 0,
    present: 0,
    off: 0
  };

  const [startTime, setStartTime] = useState<Time>(initialStartTime);
  const [duration, setDuration] = useState<Time>(initialDuration);
  const [subject, setSubject] = useState<Subject>(freeSubject);
  const [page, setPage] = useState<number>(0);
  
  const handleAdd = () => {
    const intervalsOk = checkIntervals(
      editCell ? cells.filter(c => c.id !== editCell.id) : cells,
      {
        startTime: startTime.hours * 60 + startTime.minutes,
        duration: duration.hours * 60 + duration.minutes
      }
    );

    if (!intervalsOk) {
      Toast.show('Time Interval is overlapping other Intervals', 2500);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (editCell === null) {
      addCell(db, {
        subjectId: subject.id === -1 ? null : subject.id,
        day: dayIdx,
        duration: duration.hours * 60 + duration.minutes,
        startTime: startTime.hours * 60 + startTime.minutes
      })
        .then(() => onClose(true))
        .catch(console.error)
        .finally(() => {
          setPage(0);
        });
    } else {
      updateCell(db, {
        id: editCell.id,
        subjectId: subject.id === -1 ? null : subject.id,
        duration: duration.hours * 60 + duration.minutes,
        startTime: startTime.hours * 60 + startTime.minutes
      })
        .then(() => onClose(true))
        .catch(console.error)
        .finally(() => {
          setPage(0);
        });
    }
  };

  return (
    <Modal
      animationType='none'
      visible={visible}
      onRequestClose={() => {
        setPage(0);
        onClose(false)
      }}
      transparent={true}
    >
      <View style={{
        backgroundColor: visible ? 'rgba(0, 0, 0, 0.4)' : 'none',
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <SlideUpView style={{
          width: screenWidth * 0.8,
          backgroundColor: "white",
          borderRadius: 10,
          position: 'relative'
        }}>
          <Text style={{
            padding: 10,
            fontSize: 18,
            textAlign: 'center'
          }}>
            {page === 0 ? "Choose Subject" : subject.name}
          </Text>

          {page === 0 && (
            <View style={{
              padding: 10
            }}>
              <FlatList
                data={[freeSubject, ...subjects]}
                style={{
                  height: 250,
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
            </View>
          )}

          {page === 1 && (
            <View style={{
              marginBottom: 10
            }}>
              <View style={{
                padding: 10
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
                  }
                  } />
              </View>
            </View>
          )}

          <View style={{
            display: 'flex',
            flexDirection: 'row'
          }}>
            {page === 0 && (
              <Pressable android_ripple={{
                color: 'lightgray'
              }} style={{
                marginLeft: 'auto',
                padding: 8,
                backgroundColor: 'lightgray',
                borderRadius: 5,
                marginRight: 10,
                marginBottom: 10
              }} onPress={() => setPage(1)}>
                <Text>
                  Next
                </Text>
              </Pressable>
            )}
            {page === 1 && (
              <Pressable android_ripple={{
                color: 'lightgray'
              }} style={{
                padding: 8,
                backgroundColor: 'lightgray',
                borderRadius: 5,
                marginLeft: 10,
                marginRight: 'auto',
                marginBottom: 10
              }} onPress={() => setPage(0)}>
                <Text>
                  Previous
                </Text>
              </Pressable>
            )}
            {page === 1 && (
              <Pressable android_ripple={{
                color: 'lightgray'
              }} style={{
                marginLeft: 'auto',
                padding: 8,
                backgroundColor: 'royalblue',
                borderRadius: 5,
                marginRight: 10,
                marginBottom: 10
              }} onPress={() => handleAdd()}>
                <Text style={{
                  color: 'white'
                }}>
                  {editCell === null ? "Add" : "Update"} Subject
                </Text>
              </Pressable>
            )}
          </View>
        </SlideUpView>
      </View>
    </Modal >
  );
};
