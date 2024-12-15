import { getSubjects, Subject } from '@/utils/subjects';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useLayoutEffect } from 'react';
import { View, Text, Dimensions, Modal, FlatList, Pressable, Animated, useAnimatedValue, ViewStyle } from 'react-native';
import SlideUpView from '../SlideUpView';

interface AddTimetableCellModalProps {
  visible: boolean;
  onClose: (subjectId: number|null, slotIdx: number) => void;
  slotIdx: number;
}

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default function AddTimetableCellModal({
  visible, onClose, slotIdx
}: AddTimetableCellModalProps) {
  const db = useSQLiteContext();
  const [subjects, setSubjects] = React.useState<Subject[]>([]);

  useLayoutEffect(() => {
    getSubjects(db)
      .then((data) => {
        setSubjects(data)
      })
      .catch(e => console.error(e));
  }, []);

  return (
    <Modal
      animationType='none'
      visible={visible}
      onRequestClose={() => onClose(null, slotIdx)}
      transparent={true}
    >
      <View style={{
        backgroundColor: visible ? 'rgba(0, 0, 0, 0.4)' : 'none',
      }}>
        <SlideUpView style={{
          width: screenWidth,
          marginTop: screenHeight * 0.3,
          height: screenHeight * 0.7,
          backgroundColor: "white",
          borderRadius: 10
        }}>
          <Text style={{
            padding: 10,
            marginBottom: 10
          }}>
            Choose a Subject
          </Text>

          <FlatList
            data={subjects}
            renderItem={({ item }) => (
              <Pressable android_ripple={{
                color: "lightgray"
              }} onPress={() => onClose(item.id, slotIdx)} style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "lightgray"
              }}>
                <Text>
                  {item.shortName} - {item.name}
                </Text>
              </Pressable>
            )}
          />
        </SlideUpView>
      </View>
    </Modal >
  );
};
