import DayPage from '@/components/calendar/DayPage';
import Icon from '@/components/Icon';
import { useNavigation } from 'expo-router';
import React, { Suspense, useEffect } from 'react'
import { BackHandler, NativeAppEventEmitter, Pressable, Text, View } from 'react-native'
import { CalendarList } from 'react-native-calendars'

export default function Calendar() {
  const navigator = useNavigation();
  const [currentDate, setCurrentDate] = React.useState<number | null>(null);

  const handleDayClick = (timestamp: number) => {
    setCurrentDate(timestamp);
  };

  useEffect(() => {
    if (currentDate == null) {
      navigator.setOptions({
        headerLeft: null
      });
    }
  }, [currentDate]);

  return (
    <View>
      {currentDate && (
        <DayPage
          timestamp={currentDate}
          onClose={() => setCurrentDate(null)}
        /> 
      )}

      {/* TODO: Calendar too slow. Try other alternative. */}
      <CalendarList
        style={{
          height: currentDate ? 0 : undefined
        }}
        horizontal
        theme={{}}
        pagingEnabled
        dayComponent={({ date, state }: any) => {
          return (
            <Pressable onPress={() => handleDayClick(date.timestamp)} android_ripple={{ color: 'lightgray' }} style={{
              padding: 6,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column'
            }}>
              <View style={{
                width: 26,
                height: 26,
                borderRadius: 100,
                backgroundColor: state === 'today' ? '#445ce733' : 'transparent',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row'
              }}>
                <Text style={{
                  textAlign: 'center',
                  color: state === 'today' ? 'royalblue' : 'black'
                }}>
                  {date.day}
                </Text>
              </View>

              <View style={{
                width: 6,
                height: 6,
                marginTop: 2,
                borderRadius: 100,
                backgroundColor: 'lightgray'
              }}></View>
            </Pressable>
          )
        }}
      />
    </View>
  )
}
