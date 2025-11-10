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
      {/* TODO: Add Day 2-7 screens */}
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
