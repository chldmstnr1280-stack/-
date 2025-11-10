/**
 * Day 0: Garden Intro Screen
 * 정원 소개 및 셀리 첫 만남
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { OnboardingScreenProps } from '../../navigation/types';
import { OnboardingStep } from '../../types/onboarding';
import { useOnboardingStore } from '../../store/onboardingStore';

type Props = OnboardingScreenProps<'GardenIntro'>;

const GardenIntro: React.FC<Props> = ({ navigation }) => {
  const { completeStep } = useOnboardingStore();

  const handleNext = () => {
    completeStep(OnboardingStep.GARDEN_INTRO);
    navigation.navigate('SellyStylePicker');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 정원 배경 영역 */}
        <View style={styles.gardenContainer}>
          <View style={styles.garden}>
            <Text style={styles.gardenEmoji}>🌿</Text>
            <Text style={styles.gardenEmoji}>🌱</Text>
            <Text style={styles.gardenEmoji}>🌿</Text>
          </View>

          {/* 셀리 씨앗 */}
          <View style={styles.sellyContainer}>
            <View style={styles.sellyPot}>
              <Text style={styles.seedEmoji}>🌰</Text>
            </View>
          </View>
        </View>

        {/* 소개 텍스트 */}
        <View style={styles.messageContainer}>
          <Text style={styles.title}>당신만의 감정 정원에{'\n'}오신 것을 환영해요</Text>

          <View style={styles.messageBox}>
            <Text style={styles.greeting}>안녕! 나는 셀리야 💚</Text>
            <Text style={styles.message}>
              너의 감정과 함께 성장하는 친구야.{'\n'}
              지금은 작은 씨앗이지만,{'\n'}
              너와 함께라면 아름다운 꽃으로 자랄 수 있어!
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>💡</Text>
            <Text style={styles.infoText}>
              매일 감정을 기록하면 셀리가 자라나요
            </Text>
          </View>
        </View>

        {/* 다음 버튼 */}
        <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.8}>
          <Text style={styles.buttonText}>셀리 만나러 가기</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'space-between',
  },
  gardenContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  garden: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
  },
  gardenEmoji: {
    fontSize: 32,
  },
  sellyContainer: {
    alignItems: 'center',
  },
  sellyPot: {
    width: 120,
    height: 120,
    backgroundColor: '#D4E4DC',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  seedEmoji: {
    fontSize: 64,
  },
  messageContainer: {
    gap: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5F4C',
    textAlign: 'center',
    lineHeight: 36,
  },
  messageBox: {
    backgroundColor: '#E8F4EF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#2D5F4C',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D5F4C',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2D5F4C',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoIcon: {
    fontSize: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#6B5D00',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#2D5F4C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default GardenIntro;
