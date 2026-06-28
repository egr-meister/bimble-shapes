// Simple stack navigation. Headers are hidden for a fullscreen, immersive,
// child-friendly experience; each screen provides its own large back buttons.

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BimbleHomeScreen from '../screens/BimbleHomeScreen';
import CharacterPickerScreen from '../screens/CharacterPickerScreen';
import DifficultyScreen from '../screens/DifficultyScreen';
import CharacterBuildScreen from '../screens/CharacterBuildScreen';
import FindShapeScreen from '../screens/FindShapeScreen';
import FreeBuildScreen from '../screens/FreeBuildScreen';
import StickerProgressScreen from '../screens/StickerProgressScreen';
import ParentSettingsScreen from '../screens/ParentSettingsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="Home" component={BimbleHomeScreen} />
      <Stack.Screen name="CharacterPicker" component={CharacterPickerScreen} />
      <Stack.Screen name="Difficulty" component={DifficultyScreen} />
      <Stack.Screen name="CharacterBuild" component={CharacterBuildScreen} />
      <Stack.Screen name="FindShape" component={FindShapeScreen} />
      <Stack.Screen name="FreeBuild" component={FreeBuildScreen} />
      <Stack.Screen name="StickerProgress" component={StickerProgressScreen} />
      <Stack.Screen name="ParentSettings" component={ParentSettingsScreen} />
    </Stack.Navigator>
  );
}
