import { getSubjects, Subject } from '@/utils/subjects';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, Dimensions, Modal, FlatList, Pressable } from 'react-native';
import SlideUpView from '../SlideUpView';
import { TimerPicker } from 'react-native-timer-picker';
import { getAllSlots, insertSlot, Slot, updateSlot } from '@/utils/slots';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Time, toTime } from '@/utils/functions';

interface AddSlotModalProps {
  visible: boolean;
  onClose: (added?: boolean) => void;
  editSlotId: number | null;
  slots: Slot[]
}

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default function AddSlotModal({
  visible, onClose, editSlotId, slots
}: AddSlotModalProps) {
  const db = useSQLiteContext();

  const editSlotIdx = slots.findIndex(s => s.id === editSlotId);

  if (editSlotId && editSlotIdx === -1) {
    onClose(false);
    return;
  }

  const initialSlot = editSlotIdx !== -1 ? slots[editSlotIdx] : slots.length > 0 ? slots[slots.length - 1] : {
    startTime: 510, //8:30am
    duration: 50,
  };

  const initialStartTime = toTime(initialSlot.startTime+(editSlotId === null ? initialSlot.duration : 0));
  const initialDuration = toTime(initialSlot.duration);

  const [startTime, setStartTime] = useState<Time>(initialStartTime);
  const [duration, setDuration] = useState<Time>(initialDuration);

  const handleAdd = () => {
    if (editSlotId === null) {
      insertSlot(db, {
        duration: duration.hours * 60 + duration.minutes,
        startTime: startTime.hours * 60 + startTime.minutes
      })
        .then(() => onClose(true))
        .catch(console.error);
    } else {
      updateSlot(db, {
        id: editSlotId,
        idx: editSlotIdx,
        duration: duration.hours * 60 + duration.minutes,
        startTime: startTime.hours * 60 + startTime.minutes
      })
        .then(() => onClose(true))
        .catch(console.error);
    }
  };

  return (
    <Modal
      animationType='none'
      visible={visible}
      onRequestClose={() => onClose()}
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
          borderRadius: 10
        }}>
          <Text style={{
            padding: 10,
            marginBottom: 10,
            fontSize: 16
          }}>
            {editSlotId === null ? "Add" : "Edit"} Slot {editSlotIdx !== -1 ? editSlotIdx + 1 : slots.length + 1}
          </Text>

          <View style={{}}>
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

            <Pressable onPress={handleAdd} android_ripple={{
              color: 'lightgray'
            }} style={{
              backgroundColor: 'royalblue',
              padding: 10,
              margin: 10,
              borderRadius: 10
            }}>
              <Text style={{
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                {editSlotId === null ? "Add" : "Edit"} Slot
              </Text>
            </Pressable>
          </View>
        </SlideUpView>
      </View>
    </Modal >
  );
};
