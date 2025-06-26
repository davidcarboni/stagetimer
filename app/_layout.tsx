import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import App from '../App'; // Import the timer app

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    'DMSans-Regular': require('../assets/fonts/DmSans-regular.ttf'),
    'PublicSans-Regular': require('../assets/fonts/PublicSans-regular.ttf'),
    'PublicSans-900': require('../assets/fonts/PublicSans-900.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <App />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
