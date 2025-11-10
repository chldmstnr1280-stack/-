/**
 * 메인 탭 네비게이터
 */

import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';

// Screens (to be implemented)
import HomeScreen from '../screens/main/HomeScreen';
import RoutineScreen from '../screens/main/RoutineScreen';
import MarketScreen from '../screens/main/MarketScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2D5F4C',
        tabBarInactiveTintColor: '#A0B5AC',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E8F4EF',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ color, size }) => <TabIcon icon="🏡" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Routine"
        component={RoutineScreen}
        options={{
          tabBarLabel: '루틴',
          tabBarIcon: ({ color, size }) => <TabIcon icon="🧘" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Market"
        component={MarketScreen}
        options={{
          tabBarLabel: '마켓',
          tabBarIcon: ({ color, size }) => <TabIcon icon="🛍️" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: '프로필',
          tabBarIcon: ({ color, size }) => <TabIcon icon="👤" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

// 간단한 이모지 아이콘 컴포넌트
const TabIcon: React.FC<{ icon: string; color: string; size: number }> = ({
  icon,
  size,
}) => {
  return <Text style={{ fontSize: size }}>{icon}</Text>;
};

export default MainTabNavigator;
