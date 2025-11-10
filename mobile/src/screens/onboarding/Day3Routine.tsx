/**
 * Day 3: Routine Screen
 * 첫 루틴 경험
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
  Modal,
} from 'react-native';
import { OnboardingScreenProps } from '../../navigation/types';
import { OnboardingStep } from '../../types/onboarding';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useSellyStore, rewardRoutineComplete } from '../../store/sellyStore';
import { useRoutineStore } from '../../store/routineStore';
import SellyAvatar from '../../components/selly/SellyAvatar';
import BreathingTimer from '../../components/routine/BreathingTimer';
import { MEDITATION_ROUTINES, BREATHING_PATTERNS, ACTIVITY_ROUTINES } from '../../constants/routines';
import { Routine, BreathingPattern } from '../../types/routine';

type Props = OnboardingScreenProps<'Day3Routine'>;

const Day3Routine: React.FC<Props> = ({ navigation }) => {
  const { completeStep, setCurrentDay } = useOnboardingStore();
  const sellyStore = useSellyStore();
  const { startRoutine, completeRoutine } = useRoutineStore();

  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [selectedBreathing, setSelectedBreathing] = useState<BreathingPattern | null>(null);
  const [showBreathingModal, setShowBreathingModal] = useState(false);

  const handleRoutineSelect = (routine: Routine) => {
    setSelectedRoutine(routine);

    Alert.alert(
      routine.name,
      `${routine.description}\n\n⏱️ ${Math.floor(routine.duration / 60)}분`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '시작하기',
          onPress: () => handleStartRoutine(routine),
        },
      ]
    );
  };

  const handleBreathingSelect = (breathing: BreathingPattern) => {
    setSelectedBreathing(breathing);
    setShowBreathingModal(true);
  };

  const handleStartRoutine = (routine: Routine) => {
    startRoutine(routine.id, 'temp_user');

    // 간단한 카운트다운 시뮬레이션
    Alert.alert(
      '루틴 시작',
      `${routine.name}을(를) 시작합니다!\n편안한 자세로 준비하세요.`,
      [
        {
          text: '확인',
          onPress: () => {
            // 실제로는 타이머나 플레이어 화면으로 이동
            setTimeout(() => {
              handleRoutineComplete(routine);
            }, 1000);
          },
        },
      ]
    );
  };

  const handleRoutineComplete = (routine: Routine) => {
    completeRoutine(5); // 5점 만점

    // 셀리 경험치 보상
    const evolved = rewardRoutineComplete();

    completeStep(OnboardingStep.ROUTINE_INTRO);
    completeStep(OnboardingStep.FIRST_ROUTINE);

    if (evolved) {
      Alert.alert(
        '🌸 셀리가 꽃을 피웠어요!',
        '첫 루틴을 완료했어요!\n셀리가 아름다운 꽃으로 자라났어요!',
        [
          {
            text: '확인',
            onPress: () => {
              setCurrentDay(5);
              // TODO: Navigate to Day 5 when implemented
              Alert.alert('완료', 'Day 5 화면은 아직 구현중입니다.');
            },
          },
        ]
      );
    } else {
      Alert.alert('완료! 💚', '첫 루틴을 성공적으로 완료했어요!', [
        {
          text: '확인',
          onPress: () => {
            setCurrentDay(5);
            // TODO: Navigate to Day 5 when implemented
            Alert.alert('완료', 'Day 5 화면은 아직 구현중입니다.');
          },
        },
      ]);
    }
  };

  const handleBreathingComplete = () => {
    setShowBreathingModal(false);

    if (selectedBreathing) {
      completeRoutine(5);
      const evolved = rewardRoutineComplete();

      completeStep(OnboardingStep.ROUTINE_INTRO);
      completeStep(OnboardingStep.FIRST_ROUTINE);

      if (evolved) {
        Alert.alert(
          '🌸 셀리가 꽃을 피웠어요!',
          '호흡법을 완료했어요!\n셀리가 아름다운 꽃으로 자라났어요!',
          [
            {
              text: '확인',
              onPress: () => {
                setCurrentDay(5);
                Alert.alert('완료', 'Day 5 화면은 아직 구현중입니다.');
              },
            },
          ]
        );
      } else {
        Alert.alert('완료! 💚', '호흡법을 성공적으로 완료했어요!', [
          {
            text: '확인',
            onPress: () => {
              setCurrentDay(5);
              Alert.alert('완료', 'Day 5 화면은 아직 구현중입니다.');
            },
          },
        ]);
      }
    }
  };

  const handleBreathingCancel = () => {
    setShowBreathingModal(false);
    setSelectedBreathing(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.day}>Day 3</Text>
            <Text style={styles.title}>마음 돌보는 시간</Text>
            <Text style={styles.subtitle}>셀리와 함께하는 첫 루틴을 시작해봐요</Text>
          </View>

          {/* 셀리 */}
          <View style={styles.sellySection}>
            <SellyAvatar
              stage={sellyStore.stage}
              style={sellyStore.style}
              size="large"
              showProgress
              progress={sellyStore.progress}
            />
            <View style={styles.speechBubble}>
              <Text style={styles.sellyMessage}>
                오늘은 루틴을 배워볼 거야!{'\n'}
                작은 습관이 큰 변화를 만들어 💚
              </Text>
            </View>
          </View>

          {/* 명상 */}
          <View style={styles.categorySection}>
            <Text style={styles.categoryTitle}>🧘 명상</Text>
            {MEDITATION_ROUTINES.filter(r => !r.isPremium).map(routine => (
              <TouchableOpacity
                key={routine.id}
                style={styles.routineCard}
                onPress={() => handleRoutineSelect(routine)}
                activeOpacity={0.7}>
                <Text style={styles.routineIcon}>{routine.icon}</Text>
                <View style={styles.routineInfo}>
                  <Text style={styles.routineName}>{routine.name}</Text>
                  <Text style={styles.routineDescription}>{routine.description}</Text>
                  <Text style={styles.routineDuration}>
                    ⏱️ {Math.floor(routine.duration / 60)}분
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* 호흡법 */}
          <View style={styles.categorySection}>
            <Text style={styles.categoryTitle}>🌬️ 호흡법</Text>
            {BREATHING_PATTERNS.map(breathing => (
              <TouchableOpacity
                key={breathing.id}
                style={styles.routineCard}
                onPress={() => handleBreathingSelect(breathing)}
                activeOpacity={0.7}>
                <Text style={styles.routineIcon}>💨</Text>
                <View style={styles.routineInfo}>
                  <Text style={styles.routineName}>{breathing.name}</Text>
                  <Text style={styles.routineDescription}>{breathing.description}</Text>
                  <Text style={styles.routineDuration}>
                    🔄 {breathing.cycles} 사이클
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* 활동 */}
          <View style={styles.categorySection}>
            <Text style={styles.categoryTitle}>🚶 활동</Text>
            {ACTIVITY_ROUTINES.map(routine => (
              <TouchableOpacity
                key={routine.id}
                style={styles.routineCard}
                onPress={() => handleRoutineSelect(routine)}
                activeOpacity={0.7}>
                <Text style={styles.routineIcon}>{routine.icon}</Text>
                <View style={styles.routineInfo}>
                  <Text style={styles.routineName}>{routine.name}</Text>
                  <Text style={styles.routineDescription}>{routine.description}</Text>
                  <Text style={styles.routineDuration}>
                    ⏱️ {Math.floor(routine.duration / 60)}분
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 호흡법 모달 */}
      <Modal
        visible={showBreathingModal}
        animationType="slide"
        onRequestClose={handleBreathingCancel}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedBreathing?.name}</Text>
            <Text style={styles.modalSubtitle}>{selectedBreathing?.description}</Text>
          </View>
          {selectedBreathing && (
            <BreathingTimer
              pattern={selectedBreathing}
              onComplete={handleBreathingComplete}
              onCancel={handleBreathingCancel}
            />
          )}
        </SafeAreaView>
      </Modal>
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
  sellySection: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  speechBubble: {
    backgroundColor: '#E8F4EF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#2D5F4C',
  },
  sellyMessage: {
    fontSize: 15,
    color: '#2D5F4C',
    textAlign: 'center',
    lineHeight: 22,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D5F4C',
    marginBottom: 16,
  },
  routineCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routineIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  routineInfo: {
    flex: 1,
  },
  routineName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D5F4C',
    marginBottom: 4,
  },
  routineDescription: {
    fontSize: 14,
    color: '#6B9080',
    marginBottom: 8,
  },
  routineDuration: {
    fontSize: 13,
    color: '#A0B5AC',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F9F7',
  },
  modalHeader: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D4E4DC',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5F4C',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#6B9080',
    textAlign: 'center',
  },
});

export default Day3Routine;
