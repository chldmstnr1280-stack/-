/**
 * Day 1: Emotion Log Screen
 * 첫 감정 기록 화면
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { OnboardingScreenProps } from '../../navigation/types';
import { OnboardingStep } from '../../types/onboarding';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useEmotionStore } from '../../store/emotionStore';
import { useSellyStore, rewardEmotionLog } from '../../store/sellyStore';
import { EmotionLog } from '../../types/emotion';

// Components
import EmojiPicker from '../../components/emotion/EmojiPicker';
import ColorPicker from '../../components/emotion/ColorPicker';
import TemperatureGauge from '../../components/emotion/TemperatureGauge';

type Props = OnboardingScreenProps<'Day1EmotionLog'>;

const Day1EmotionLog: React.FC<Props> = ({ navigation }) => {
  const { completeStep } = useOnboardingStore();
  const { addEmotion } = useEmotionStore();
  const sellyStore = useSellyStore();

  const [text, setText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [temperature, setTemperature] = useState(50);
  const [showTemperature, setShowTemperature] = useState(false);

  const calculateAutoTemperature = (): number => {
    // 간단한 감정 온도 자동 계산 (실제로는 더 복잡한 알고리즘 사용)
    const positiveEmojis = ['😊', '😌', '🤗', '🥰', '😎'];
    const negativeEmojis = ['😢', '😰', '😠', '😔', '😤', '😳', '🥺'];

    if (positiveEmojis.includes(selectedEmoji)) {
      return Math.random() * 30 + 60; // 60-90
    } else if (negativeEmojis.includes(selectedEmoji)) {
      return Math.random() * 30 + 20; // 20-50
    }
    return 50; // 중립
  };

  const handleSave = () => {
    // 유효성 검사
    if (!text.trim()) {
      Alert.alert('알림', '감정을 텍스트로 표현해주세요');
      return;
    }
    if (!selectedEmoji) {
      Alert.alert('알림', '기분 이모지를 선택해주세요');
      return;
    }
    if (!selectedColor) {
      Alert.alert('알림', '감정의 색깔을 선택해주세요');
      return;
    }

    const finalTemperature = showTemperature ? temperature : calculateAutoTemperature();

    // 감정 기록 생성
    const emotionLog: EmotionLog = {
      id: `emotion_${Date.now()}`,
      userId: 'temp_user', // TODO: Replace with real user ID
      date: new Date(),
      text: text.trim(),
      emoji: selectedEmoji,
      color: selectedColor,
      temperature: Math.round(finalTemperature),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 저장
    addEmotion(emotionLog);

    // 셀리 경험치 추가
    const evolved = rewardEmotionLog();

    // 온보딩 단계 완료
    completeStep(OnboardingStep.FIRST_EMOTION_LOG);

    // 진화 여부에 따라 다른 메시지
    if (evolved) {
      Alert.alert(
        '🎉 셀리가 자랐어요!',
        '첫 감정 기록을 완료했어요!\n셀리가 새싹으로 자라났습니다!',
        [
          {
            text: '확인',
            onPress: () => {
              // TODO: Navigate to Day2ActivitySync when implemented
              Alert.alert('완료', 'Day 2 화면은 아직 구현중입니다.');
            },
          },
        ]
      );
    } else {
      Alert.alert('완료! 💚', '첫 감정 기록을 성공적으로 저장했어요!', [
        {
          text: '확인',
          onPress: () => {
            // TODO: Navigate to next screen
            Alert.alert('완료', 'Day 2 화면은 아직 구현중입니다.');
          },
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            {/* 헤더 */}
            <View style={styles.header}>
              <Text style={styles.day}>Day 1</Text>
              <Text style={styles.title}>오늘의 감정을 기록해보세요</Text>
              <Text style={styles.subtitle}>셀리와 함께하는 첫 번째 감정 여행이에요</Text>
            </View>

            {/* 셀리 표시 */}
            <View style={styles.sellyContainer}>
              <View style={styles.sellyCircle}>
                <Text style={styles.sellyEmoji}>
                  {sellyStore.stage === 'seed' ? '🌰' : '🌱'}
                </Text>
              </View>
              <View style={styles.speechBubble}>
                <Text style={styles.sellyMessage}>
                  오늘 하루 어땠어?{'\n'}
                  편하게 이야기해줘! 💚
                </Text>
              </View>
            </View>

            {/* 텍스트 입력 */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>감정을 표현해보세요</Text>
              <TextInput
                style={styles.textInput}
                placeholder="예: 오늘은 피곤하지만 뿌듯해요"
                placeholderTextColor="#A0B5AC"
                value={text}
                onChangeText={setText}
                maxLength={100}
                multiline
                numberOfLines={3}
              />
              <Text style={styles.charCount}>{text.length}/100</Text>
            </View>

            {/* 이모지 선택 */}
            <EmojiPicker selectedEmoji={selectedEmoji} onSelect={setSelectedEmoji} />

            {/* 색상 선택 */}
            <ColorPicker selectedColor={selectedColor} onSelect={setSelectedColor} />

            {/* 온도계 토글 */}
            <TouchableOpacity
              style={styles.temperatureToggle}
              onPress={() => setShowTemperature(!showTemperature)}
              activeOpacity={0.7}>
              <Text style={styles.temperatureToggleText}>
                {showTemperature ? '감정 온도 숨기기' : '감정 온도 직접 설정하기'}
              </Text>
              <Text style={styles.temperatureToggleIcon}>
                {showTemperature ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>

            {/* 온도계 (선택사항) */}
            {showTemperature && (
              <TemperatureGauge temperature={temperature} onChange={setTemperature} />
            )}

            {/* 저장 버튼 */}
            <TouchableOpacity
              style={[
                styles.saveButton,
                (!text.trim() || !selectedEmoji || !selectedColor) && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              activeOpacity={0.8}
              disabled={!text.trim() || !selectedEmoji || !selectedColor}>
              <Text style={styles.saveButtonText}>감정 기록 완료</Text>
            </TouchableOpacity>

            {/* 안내 */}
            <Text style={styles.hint}>
              💡 매일 감정을 기록하면 셀리가 자라고 포인트를 얻을 수 있어요
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginBottom: 24,
  },
  day: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B9080',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D5F4C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B9080',
  },
  sellyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F4EF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  sellyCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sellyEmoji: {
    fontSize: 32,
  },
  speechBubble: {
    flex: 1,
  },
  sellyMessage: {
    fontSize: 15,
    color: '#2D5F4C',
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D5F4C',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2D5F4C',
    borderWidth: 1,
    borderColor: '#D4E4DC',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#A0B5AC',
    textAlign: 'right',
    marginTop: 4,
  },
  temperatureToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  temperatureToggleText: {
    fontSize: 15,
    color: '#6B5D00',
    fontWeight: '500',
  },
  temperatureToggleIcon: {
    fontSize: 16,
    color: '#6B5D00',
  },
  saveButton: {
    backgroundColor: '#2D5F4C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  saveButtonDisabled: {
    backgroundColor: '#A0B5AC',
  },
  saveButtonText: {
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

export default Day1EmotionLog;
