/**
 * Day 0: Selly Style Picker Screen
 * 셀리 스타일(색상) 선택
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { OnboardingScreenProps } from '../../navigation/types';
import { OnboardingStep } from '../../types/onboarding';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useSellyStore } from '../../store/sellyStore';
import { SellyStyle } from '../../types/selly';

type Props = OnboardingScreenProps<'SellyStylePicker'>;

interface StyleOption {
  style: SellyStyle;
  name: string;
  description: string;
  emoji: string;
  color: string;
  bgColor: string;
}

const STYLE_OPTIONS: StyleOption[] = [
  {
    style: SellyStyle.GREEN,
    name: '평온한 숲',
    description: '차분하고 안정적인 초록 셀리',
    emoji: '🌲',
    color: '#2D5F4C',
    bgColor: '#E8F4EF',
  },
  {
    style: SellyStyle.PINK,
    name: '따뜻한 봄',
    description: '부드럽고 사랑스러운 분홍 셀리',
    emoji: '🌸',
    color: '#D5006D',
    bgColor: '#FFF0F7',
  },
  {
    style: SellyStyle.BLUE,
    name: '시원한 바다',
    description: '맑고 상쾌한 파랑 셀리',
    emoji: '🌊',
    color: '#1E88E5',
    bgColor: '#E3F2FD',
  },
];

const SellyStylePicker: React.FC<Props> = ({ navigation }) => {
  const { completeStep, setCurrentDay } = useOnboardingStore();
  const { setStyle } = useSellyStore();
  const [selectedStyle, setSelectedStyle] = useState<SellyStyle | null>(null);

  const handleComplete = () => {
    if (!selectedStyle) {
      Alert.alert('알림', '셀리의 스타일을 선택해주세요');
      return;
    }

    // Save selly style to store
    setStyle(selectedStyle);
    console.log('Selected selly style:', selectedStyle);

    completeStep(OnboardingStep.SELLY_STYLE_PICKER);
    setCurrentDay(1);

    // Navigate to Day 1
    navigation.navigate('Day1EmotionLog');
  };

  const renderStyleOption = (option: StyleOption) => {
    const isSelected = selectedStyle === option.style;

    return (
      <TouchableOpacity
        key={option.style}
        style={[
          styles.optionCard,
          { backgroundColor: option.bgColor },
          isSelected && { borderColor: option.color, borderWidth: 3 },
        ]}
        onPress={() => setSelectedStyle(option.style)}
        activeOpacity={0.7}>
        {/* 이모지 & 선택 표시 */}
        <View style={styles.optionHeader}>
          <Text style={styles.optionEmoji}>{option.emoji}</Text>
          {isSelected && (
            <View style={[styles.checkBadge, { backgroundColor: option.color }]}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          )}
        </View>

        {/* 셀리 미리보기 */}
        <View style={[styles.sellyPreview, { backgroundColor: '#FFFFFF' }]}>
          <Text style={styles.sellyEmoji}>🌱</Text>
          <View style={[styles.colorDot, { backgroundColor: option.color }]} />
        </View>

        {/* 설명 */}
        <View style={styles.optionInfo}>
          <Text style={[styles.optionName, { color: option.color }]}>{option.name}</Text>
          <Text style={styles.optionDescription}>{option.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.title}>셀리의 스타일을 선택하세요</Text>
            <Text style={styles.subtitle}>
              당신의 마음에 드는 색상을 골라주세요{'\n'}
              언제든지 정원 마켓에서 변경할 수 있어요
            </Text>
          </View>

          {/* 스타일 옵션 */}
          <View style={styles.optionsContainer}>
            {STYLE_OPTIONS.map(option => renderStyleOption(option))}
          </View>

          {/* 완료 버튼 */}
          <TouchableOpacity
            style={[styles.button, !selectedStyle && styles.buttonDisabled]}
            onPress={handleComplete}
            activeOpacity={0.8}
            disabled={!selectedStyle}>
            <Text style={styles.buttonText}>
              {selectedStyle ? '셀리와 함께 시작하기' : '스타일을 선택해주세요'}
            </Text>
          </TouchableOpacity>

          {/* 안내 */}
          <Text style={styles.hint}>💡 나중에 정원 마켓에서 다른 색상으로 변경할 수 있어요</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9F7',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D5F4C',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B9080',
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  optionCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionEmoji: {
    fontSize: 32,
  },
  checkBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sellyPreview: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  sellyEmoji: {
    fontSize: 48,
  },
  colorDot: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  optionInfo: {
    alignItems: 'center',
  },
  optionName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B9080',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2D5F4C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#A0B5AC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  hint: {
    fontSize: 13,
    color: '#A0B5AC',
    textAlign: 'center',
  },
});

export default SellyStylePicker;
