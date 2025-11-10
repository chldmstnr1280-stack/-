/**
 * Root Navigator
 * 온보딩과 메인 앱을 전환하는 루트 네비게이터
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useOnboardingStore } from '../store/onboardingStore';

import OnboardingNavigator from './OnboardingNavigator';
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { isComplete } = useOnboardingStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isComplete ? (
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      ) : (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
