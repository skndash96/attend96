import DayPage from '@/components/calendar/DayPage';
import Icon from '@/components/Icon';
import { getSubjects, Subject } from '@/utils/subjects';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { Suspense, useEffect } from 'react'
import { BackHandler, NativeAppEventEmitter, Pressable, Text, View } from 'react-native'
import { CalendarList, Calendar as RNCalendar } from 'react-native-calendars'
import Animated, { FadeIn, FadeOut, SlideInRight } from 'react-native-reanimated';

export default function Calendar() {
  const navigator = useNavigation();
  const db = useSQLiteContext();
  const [currentDate, setCurrentDate] = React.useState<number | null>(null);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const isFocused = useIsFocused();

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

  useEffect(() => {
    getSubjects(db)
      .then((subjects) => {
        setSubjects(subjects);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [isFocused]);  

  return (
    <View>
      {currentDate ? (
        <DayPage
          subjects={subjects}
          timestamp={currentDate}
          onClose={() => setCurrentDate(null)}
        />
      ) : (
        <Animated.View entering={FadeIn.duration(200)}>
          <RNCalendar
            enableSwipeMonths
            hideExtraDays
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
        </Animated.View>
      )}
    </View>
  )
}
