/**
 * SELLERY - Self Love Reset
 * Main App Component
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/navigation/types';
import OnboardingNavigator from './src/navigation/OnboardingNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  // TODO: Check if onboarding is complete
  const isOnboardingComplete = false;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {!isOnboardingComplete ? (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          // TODO: Add Main navigator
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
