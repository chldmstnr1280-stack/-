/**
 * 온보딩 네비게이터
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from './types';

// Screens
import Day0Welcome from '../screens/onboarding/Day0Welcome';
import ProfileSetup from '../screens/onboarding/ProfileSetup';
import GardenIntro from '../screens/onboarding/GardenIntro';
import SellyStylePicker from '../screens/onboarding/SellyStylePicker';
import Day1EmotionLog from '../screens/onboarding/Day1EmotionLog';
import Day2ActivitySync from '../screens/onboarding/Day2ActivitySync';
import Day3Routine from '../screens/onboarding/Day3Routine';
import Day5CheckIn from '../screens/onboarding/Day5CheckIn';
import Day7Completion from '../screens/onboarding/Day7Completion';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const OnboardingNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Day0Welcome" component={Day0Welcome} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetup} />
      <Stack.Screen name="GardenIntro" component={GardenIntro} />
      <Stack.Screen name="SellyStylePicker" component={SellyStylePicker} />
      <Stack.Screen name="Day1EmotionLog" component={Day1EmotionLog} />
      <Stack.Screen name="Day2ActivitySync" component={Day2ActivitySync} />
      <Stack.Screen name="Day3Routine" component={Day3Routine} />
      <Stack.Screen name="Day5CheckIn" component={Day5CheckIn} />
      <Stack.Screen name="Day7Completion" component={Day7Completion} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
