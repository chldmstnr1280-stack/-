/**
 * Day 0: Welcome Screen
 * 첫 번째 온보딩 화면
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { OnboardingScreenProps } from '../../navigation/types';
import { OnboardingStep } from '../../types/onboarding';
import { useOnboardingStore } from '../../store/onboardingStore';

type Props = OnboardingScreenProps<'Day0Welcome'>;

const Day0Welcome: React.FC<Props> = ({ navigation }) => {
  const { completeStep } = useOnboardingStore();

  const handleStart = () => {
    completeStep(OnboardingStep.WELCOME);
    navigation.navigate('ProfileSetup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 로고 영역 */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🌱</Text>
          <Text style={styles.title}>SELLERY</Text>
          <Text style={styles.subtitle}>Self Love Reset</Text>
        </View>

        {/* 메시지 */}
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            감정의 정원에서{'\n'}
            성장하는 HSP를 위한{'\n'}
            디지털 치료제
          </Text>
          <Text style={styles.description}>
            당신의 감정을 이해하고,{'\n'}
            셀리와 함께 성장해요 💚
          </Text>
        </View>

        {/* 시작 버튼 */}
        <TouchableOpacity style={styles.button} onPress={handleStart} activeOpacity={0.8}>
          <Text style={styles.buttonText}>시작하기</Text>
        </TouchableOpacity>

        {/* 정보 */}
        <Text style={styles.info}>7일간의 여정이 시작됩니다</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9F7',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingVertical: 48,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2D5F4C',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B9080',
    marginTop: 8,
  },
  messageContainer: {
    alignItems: 'center',
    gap: 24,
  },
  message: {
    fontSize: 20,
    lineHeight: 32,
    textAlign: 'center',
    color: '#2D5F4C',
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#6B9080',
  },
  button: {
    backgroundColor: '#2D5F4C',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  info: {
    fontSize: 14,
    color: '#A0B5AC',
    marginBottom: 20,
  },
});

export default Day0Welcome;
