import { View, Text, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from 'expo-router';
import Icon from '@/components/Icon';

export default function Settings() {
  const navigator = useNavigation();

  useEffect(() => {
    navigator.setOptions({
      headerTitle: 'Settings'
    });
  }, []);

  return (
    <View style={{
    }}>
      <Pressable android_ripple={{
        color: 'lightgray'
      }} style={{
        padding: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10
        }}>
          <Icon name='bullseye' family='fa6' size={20} />
          <Text>
            Set Attendance Criteria - 75%
          </Text>
        </View>
      </Pressable>
      <Pressable android_ripple={{
        color: 'lightgray'
      }} style={{
        padding: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10
        }}>
          <Icon name='exit' size={24} />
          <Text>
            Export Data
          </Text>
        </View>
      </Pressable>
      <Pressable android_ripple={{
        color: 'lightgray'
      }} style={{
        padding: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10
        }}>
          <Icon name='file-import' family='fa6' size={20} />
          <Text>
            Import Data
          </Text>
        </View>
      </Pressable>
    </View>
  )
}