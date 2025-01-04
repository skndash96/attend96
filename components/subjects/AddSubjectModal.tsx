import React, { useEffect, useState } from 'react'
import { Modal, Pressable, Text, TextInput, View } from 'react-native'
import SlideUpView from '../SlideUpView'
import { createSubject, Subject, updateSubject } from '@/utils/subjects';
import { useSQLiteContext } from 'expo-sqlite';
import * as Haptics from 'expo-haptics';
import Toast from "react-native-simple-toast";

export default function AddSubjectModal({
  visible,
  onClose,
  editing
}: {
  editing: Subject | null,
  visible: boolean,
  onClose: (added?: boolean) => void
}) {
  const db = useSQLiteContext();
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');

  useEffect(() => {
    setName(editing === null ? '' : editing.name);
    setShortName(editing === null ? '' : editing.shortName);
  }, [editing]);

  const handleOnSubmit = () => {
    if (name.length === 0 || shortName.length === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.show('Please fill all the fields', 2500);
      return;   
    }

    if (editing) {
      updateSubject(db, editing, { name, shortName })
      .then(() => {
        onClose(true);
      })
      .catch(e => {
        console.error(e);
      });
    } else {
      createSubject(db, name, shortName)
      .then(() => {
        onClose(true);
      })
      .catch(e => {
        console.error(e);
      });
    }
    setName('');
    setShortName('');
  };

  return (
    <Modal onRequestClose={() => onClose(false)} visible={visible} transparent>
      <View style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}>
        <SlideUpView style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 10,
          width: '80%',
          display: 'flex',
          flexDirection: 'column',
          rowGap: 10,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold'
          }}>
            {editing ? 'Edit Subject' : 'Add Subject'}
          </Text>

          <View>
            <Text>Name</Text>
            <TextInput value={name} defaultValue={name} onChangeText={t => setName(t)} placeholder='Subject' style={{
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              padding: 10,
              borderRadius: 5,
              marginTop: 10
            }} />
          </View>

          <View>
            <Text>Short Name</Text>
            <TextInput value={shortName} defaultValue={shortName} onChangeText={t => setShortName(t)} placeholder='SUB (3-4 letters)' style={{
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              padding: 10,
              borderRadius: 5,
              marginTop: 10
            }} />
          </View>

          <Pressable onPress={handleOnSubmit} android_ripple={{
            color: 'lightgray'
          }} style={{
            backgroundColor: 'royalblue',
            padding: 10,
            borderRadius: 5,
            marginTop: 10
          }}>
            <Text style={{
              color: 'white',
              textAlign: 'center'
            }}>
              {editing ? 'Update' : 'Add'}
            </Text>
          </Pressable>
        </SlideUpView>
      </View>
    </Modal>
  )
}
