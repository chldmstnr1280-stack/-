/**
 * 네비게이션 타입 정의
 */

import { NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// 온보딩 스택
export type OnboardingStackParamList = {
  Day0Welcome: undefined;
  ProfileSetup: undefined;
  GardenIntro: undefined;
  SellyStylePicker: undefined;
  Day1EmotionLog: undefined;
  Day2ActivitySync: undefined;
  Day3Routine: undefined;
  Day5CheckIn: undefined;
  Day7Completion: undefined;
};

// 메인 탭
export type MainTabParamList = {
  Home: undefined;
  Routine: undefined;
  Market: undefined;
  Profile: undefined;
};

// 루트 스택
export type RootStackParamList = {
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

// 타입 헬퍼
export type OnboardingScreenProps<T extends keyof OnboardingStackParamList> =
  NativeStackScreenProps<OnboardingStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = BottomTabScreenProps<
  MainTabParamList,
  T
>;

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
