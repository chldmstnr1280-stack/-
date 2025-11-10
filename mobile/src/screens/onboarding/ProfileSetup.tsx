/**
 * Day 0: Profile Setup Screen
 * 사용자 프로필 설정 및 HSP 자가 진단
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
} from 'react-native';
import { OnboardingScreenProps } from '../../navigation/types';
import { OnboardingStep } from '../../types/onboarding';
import { useOnboardingStore } from '../../store/onboardingStore';
import { HSP_QUESTIONS, HSPLevel } from '../../types/user';

type Props = OnboardingScreenProps<'ProfileSetup'>;

const ProfileSetup: React.FC<Props> = ({ navigation }) => {
  const { completeStep } = useOnboardingStore();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [hspAnswers, setHspAnswers] = useState<boolean[]>(Array(5).fill(false));

  const calculateHSPLevel = (): HSPLevel => {
    const yesCount = hspAnswers.filter(Boolean).length;
    if (yesCount >= 4) return 'high';
    if (yesCount >= 2) return 'medium';
    return 'low';
  };

  const handleNext = () => {
    if (!name.trim()) {
      Alert.alert('알림', '이름을 입력해주세요');
      return;
    }
    if (!age || parseInt(age) < 10 || parseInt(age) > 100) {
      Alert.alert('알림', '올바른 나이를 입력해주세요');
      return;
    }

    const hspLevel = calculateHSPLevel();
    // TODO: Store user profile
    console.log({ name, age: parseInt(age), hspLevel });

    completeStep(OnboardingStep.PROFILE_SETUP);
    navigation.navigate('GardenIntro');
  };

  const toggleHSPAnswer = (index: number) => {
    const newAnswers = [...hspAnswers];
    newAnswers[index] = !newAnswers[index];
    setHspAnswers(newAnswers);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.title}>당신을 소개해주세요</Text>
            <Text style={styles.subtitle}>셀리가 당신을 알아가고 싶어해요</Text>
          </View>

          {/* 이름 입력 */}
          <View style={styles.section}>
            <Text style={styles.label}>이름</Text>
            <TextInput
              style={styles.input}
              placeholder="이름을 입력하세요"
              value={name}
              onChangeText={setName}
              maxLength={20}
            />
          </View>

          {/* 나이 입력 */}
          <View style={styles.section}>
            <Text style={styles.label}>나이</Text>
            <TextInput
              style={styles.input}
              placeholder="나이를 입력하세요"
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              maxLength={3}
            />
          </View>

          {/* HSP 자가 진단 */}
          <View style={styles.section}>
            <Text style={styles.label}>간단한 HSP 체크 ✨</Text>
            <Text style={styles.hspDescription}>
              해당되는 항목을 선택해주세요 (정답은 없어요)
            </Text>

            {HSP_QUESTIONS.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.checkItem, hspAnswers[index] && styles.checkItemSelected]}
                onPress={() => toggleHSPAnswer(index)}
                activeOpacity={0.7}>
                <View style={[styles.checkbox, hspAnswers[index] && styles.checkboxSelected]}>
                  {hspAnswers[index] && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text
                  style={[styles.checkText, hspAnswers[index] && styles.checkTextSelected]}>
                  {question}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 다음 버튼 */}
          <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.buttonText}>다음</Text>
          </TouchableOpacity>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B9080',
  },
  section: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D5F4C',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2D5F4C',
    borderWidth: 1,
    borderColor: '#D4E4DC',
  },
  hspDescription: {
    fontSize: 14,
    color: '#6B9080',
    marginBottom: 16,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D4E4DC',
  },
  checkItemSelected: {
    backgroundColor: '#E8F4EF',
    borderColor: '#2D5F4C',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#A0B5AC',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#2D5F4C',
    borderColor: '#2D5F4C',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkText: {
    flex: 1,
    fontSize: 15,
    color: '#2D5F4C',
    lineHeight: 22,
  },
  checkTextSelected: {
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#2D5F4C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ProfileSetup;
