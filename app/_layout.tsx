import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    'DMSans-Regular': require('../assets/fonts/DmSans-regular.ttf'),
    'DMSans-700': require('../assets/fonts/DmSans-700.ttf'),
    'DMSans-900': require('../assets/fonts/DmSans-900.ttf'),
    'PublicSans-Regular': require('../assets/fonts/PublicSans-regular.ttf'),
    'PublicSans-700': require('../assets/fonts/PublicSans-700.ttf'),
    'PublicSans-900': require('../assets/fonts/PublicSans-900.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Slot />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
