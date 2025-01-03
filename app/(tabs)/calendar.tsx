import DayPage from '@/components/calendar/DayPage';
import Icon from '@/components/Icon';
import { Time } from '@/utils/functions';
import { getMonthData, Marking, markingColors, MonthData } from '@/utils/monthData';
import { getSubjects, Subject } from '@/utils/subjects';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { Suspense, useEffect } from 'react'
import { BackHandler, Dimensions, NativeAppEventEmitter, Pressable, Text, View } from 'react-native'
import { CalendarList, Calendar as RNCalendar } from 'react-native-calendars'
import Animated, { FadeIn, FadeOut, SlideInRight } from 'react-native-reanimated';

const screenWidth = Dimensions.get('screen').width;

export default function Calendar() {
  const navigator = useNavigation();
  const db = useSQLiteContext();
  const [currentDate, setCurrentDate] = React.useState<number | null>(null);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const isFocused = useIsFocused();
  const [month, setMonth] = React.useState<Date>(new Date());
  const [monthData, setMonthData] = React.useState<MonthData | null>(null);

  const handleDayClick = (timestamp: number) => {
    setCurrentDate(timestamp);
  };

  useEffect(() => {
    if (currentDate == null) {
      navigator.setOptions({
        headerTitle: null,
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

  useEffect(() => {
    if (currentDate !== null) return;

    getMonthData(db, month)
      .then(data => {
        setMonthData(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [currentDate, month]);

  const handleDayPageBack = () => {
    setCurrentDate(null);
  };

  return (
    <View>
      {currentDate ? (
        <DayPage
          subjects={subjects}
          timestamp={currentDate}
          onClose={handleDayPageBack}
        />
      ) : (
        <Animated.View entering={FadeIn.duration(200)}>
          <RNCalendar
            enableSwipeMonths
            hideExtraDays
            onMonthChange={(dateData: any) => setMonth(new Date(dateData.timestamp))}
            dayComponent={({ date, state }: any) => {
              let marking = markingColors[monthData?.markings[date.day] ?? Marking.NoData];

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
                    backgroundColor: marking
                  }}></View>
                </Pressable>
              )
            }}
          />

          <View style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            borderWidth: 1,
            borderRadius: 10,
            borderColor: 'lightgray',
            margin: 10
          }}>
            {[2, 0, 1, 4, 5, 3].map((i: Marking) => (
              <View key={i} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                padding: 10,
                width: screenWidth / 4 - 4
              }}>
                <Text style={{
                  fontSize: 12
                }}>
                  {monthData?.count[i] ?? 0}
                </Text>
                <View style={{
                  width: 6,
                  height: 6,
                  marginTop: -8,
                  borderRadius: 100,
                  backgroundColor: markingColors[i]
                }} />
                <Text style={{
                  marginTop: -5,
                  fontSize: 10
                }}>
                  {Marking[i] === "RequiresMarking" ? "No Entry" : Marking[i] === "NoData" ? "No Data" : Marking[i]}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  )
}
