/**
 * 온보딩 네비게이터
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from './types';

// Screens
import Day0Welcome from '../screens/onboarding/Day0Welcome';
import ProfileSetup from '../screens/onboarding/ProfileSetup';

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
      {/* TODO: Add more onboarding screens */}
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
