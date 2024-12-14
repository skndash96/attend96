import Header from '@/components/Header';
import Icon from '@/components/Icon';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        animation: "shift",
        tabBarActiveTintColor: 'royalblue',
        headerShown: true,
        header(props) {
          return <Header {...props} />
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabelStyle: {
            fontSize: 12
          },
          tabBarStyle: {
           height: 52
          },
          tabBarIcon: ({ color, focused }) => <Icon name={focused ? "home" : "home-outline"} size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="timetable"
        options={{
          title: 'Timetable',
          tabBarLabelStyle: {
            fontSize: 12
          },
          tabBarStyle: {
           height: 52
          },
          tabBarIcon: ({ color, focused }) => <Icon name={focused ? "time" : "time-outline"} size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarLabelStyle: {
            fontSize: 12
          },
          tabBarStyle: {
           height: 52
          },
          tabBarIcon: ({ color, focused }) => <Icon name={focused ? "calendar" : "calendar-outline"} size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="subjects"
        options={{
          title: 'Subjects',
          tabBarLabelStyle: {
            fontSize: 12
          },
          tabBarStyle: {
           height: 52
          },
          tabBarIcon: ({ color, focused }) => <Icon name={focused ? "book" : "book-outline"} size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
