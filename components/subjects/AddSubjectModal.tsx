import React from 'react'
import { Alert, Button, Modal, Pressable, Text, TextInput, View } from 'react-native'
import SlideUpView from '../SlideUpView'
import { createSubject } from '@/utils/subjects';
import { useSQLiteContext } from 'expo-sqlite';

export default function AddSubjectModal({
  visible,
  onClose
}: {
  visible: boolean,
  onClose: (added?: boolean) => void
}) {
  const db = useSQLiteContext();
  const [name, setName] = React.useState('');
  const [shortName, setShortName] = React.useState('');

  const handleOnSubmit = () => {
    createSubject(db, name, shortName)
    .then(() => {
      onClose(true);
    })
    .catch(e => {
      Alert.alert('Error', 'An error occurred while adding the subject');
      console.error(e);
    });
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
            Add a new subject
          </Text>

          <View>
            <Text>Name</Text>
            <TextInput value={name} onChangeText={t => setName(t)} placeholder='Physics' style={{
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              padding: 10,
              borderRadius: 5,
              marginTop: 10
            }} />
          </View>

          <View>
            <Text>Short Name</Text>
            <TextInput value={shortName} onChangeText={t => setShortName(t)} placeholder='Phy' style={{
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              padding: 10,
              borderRadius: 5,
              marginTop: 10
            }} />
          </View>

          <Pressable onPress={handleOnSubmit} disabled={name.length === 0 && shortName.length === 0} android_ripple={{
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
              Add
            </Text>
          </Pressable>
        </SlideUpView>
      </View>
    </Modal>
  )
}
