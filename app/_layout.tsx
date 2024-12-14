import Header from '@/components/Header';
import { initDb } from '@/utils/init';
import { Stack } from 'expo-router/stack';
import { SQLiteProvider } from 'expo-sqlite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <SQLiteProvider onInit={initDb} databaseName="test.db">
      <GestureHandlerRootView style={{
        flex: 1
      }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{
            headerShown: false,
          }} />
        </Stack>
      </GestureHandlerRootView>
    </SQLiteProvider>
  );
}
