// Bimble Shapes — app entry.
// Offline, no permissions, portrait, fullscreen sticky immersive.

import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SystemBars } from 'react-native-edge-to-edge';

import AppNavigator from './src/navigation/AppNavigator';
import colors from './src/theme/colors';
import { enableStickyImmersiveMode } from './src/utils/immersiveHelpers';

// Always extend DefaultTheme — never build a navigation theme from scratch.
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.card,
    primary: colors.primary,
    text: colors.text,
    border: colors.border,
  },
};

export default function App() {
  useEffect(() => {
    // Best-effort fullscreen immersive on Android (safe if API is missing).
    enableStickyImmersiveMode();
  }, []);

  return (
    <SafeAreaProvider>
      {/* Hide both system bars for a fullscreen, child-friendly experience.
          Bars reappear temporarily after an edge swipe (sticky immersive). */}
      <SystemBars hidden style="dark" />
      <NavigationContainer theme={navTheme}>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
