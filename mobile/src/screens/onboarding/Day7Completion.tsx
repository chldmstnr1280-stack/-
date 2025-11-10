/**
 * Day 7: Completion Screen
 * 온보딩 완료 축하 화면
 */

import React, { useEffect } from 'react';
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
import { useEmotionStore } from '../../store/emotionStore';
import { useRoutineStore } from '../../store/routineStore';
import { useSurveyStore } from '../../store/surveyStore';
import SellyAvatar from '../../components/selly/SellyAvatar';
import { SellyStage } from '../../types/selly';

type Props = OnboardingScreenProps<'Day7Completion'>;

interface Achievement {
  icon: string;
  title: string;
  value: string;
  description: string;
}

const Day7Completion: React.FC<Props> = ({ navigation }) => {
  const { completeStep, setIsComplete, completedSteps } = useOnboardingStore();
  const sellyStore = useSellyStore();
  const emotionStore = useEmotionStore();
  const routineStore = useRoutineStore();
  const surveyStore = useSurveyStore();

  useEffect(() => {
    // 최종 로그 단계 완료
    completeStep(OnboardingStep.FINAL_LOG);

    // 셀리가 베이비 단계에 도달했는지 확인
    if (sellyStore.stage === SellyStage.BABY) {
      completeStep(OnboardingStep.SELLY_BABY);
    }

    // 축하 단계 완료
    completeStep(OnboardingStep.COMPLETION_CELEBRATION);
  }, []);

  // 성취 통계 계산
  const achievements: Achievement[] = [
    {
      icon: '📅',
      title: '7일 완주',
      value: '7/7일',
      description: '꾸준히 실천했어요',
    },
    {
      icon: '💭',
      title: '감정 기록',
      value: `${emotionStore.logs.length}회`,
      description: '내 마음을 들여다봤어요',
    },
    {
      icon: '🧘',
      title: '루틴 완료',
      value: `${routineStore.completedRoutines.length}회`,
      description: '마음을 돌봤어요',
    },
    {
      icon: '📊',
      title: '설문 완료',
      value: `${surveyStore.results.length}회`,
      description: '나를 이해했어요',
    },
  ];

  const handleStartApp = () => {
    Alert.alert(
      '🎉 환영합니다!',
      '이제 본격적으로 셀리와 함께\n마음 돌봄 여정을 시작해요!',
      [
        {
          text: '시작하기',
          onPress: () => {
            // 온보딩 완료 처리 - RootNavigator가 자동으로 Main으로 전환
            setIsComplete(true);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.day}>Day 7</Text>
            <Text style={styles.title}>축하합니다! 🎉</Text>
            <Text style={styles.subtitle}>
              7일간의 여정을 모두 완주했어요!
            </Text>
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
                {sellyStore.stage === SellyStage.BABY
                  ? '나는 셀리야! 💚\n너와 함께 성장해서 행복해!'
                  : '우리 함께 여기까지 왔어!\n정말 자랑스러워 💚'}
              </Text>
            </View>

            {/* 셀리 진화 완료 배지 */}
            {sellyStore.stage === SellyStage.BABY && (
              <View style={styles.badgeContainer}>
                <View style={styles.badge}>
                  <Text style={styles.badgeIcon}>🌟</Text>
                  <Text style={styles.badgeText}>셀리 진화 완료!</Text>
                </View>
              </View>
            )}
          </View>

          {/* 성취 요약 */}
          <View style={styles.achievementsSection}>
            <Text style={styles.sectionTitle}>당신의 성취</Text>
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementCard}>
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementValue}>{achievement.value}</Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* 메시지 */}
          <View style={styles.messageSection}>
            <Text style={styles.messageTitle}>앞으로도 함께해요</Text>
            <Text style={styles.messageText}>
              7일은 끝이 아닌 시작이에요.{'\n'}
              셀리와 함께 매일 조금씩{'\n'}
              더 나은 나를 만들어가요.
            </Text>
          </View>

          {/* 시작 버튼 */}
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartApp}
            activeOpacity={0.8}>
            <Text style={styles.startButtonText}>정원으로 들어가기</Text>
            <Text style={styles.startButtonEmoji}>🌸</Text>
          </TouchableOpacity>

          {/* 경험치 정보 */}
          <View style={styles.expInfo}>
            <Text style={styles.expText}>
              총 경험치: {sellyStore.experience} XP
            </Text>
            <Text style={styles.expSubtext}>
              계속해서 성장하며 더 많은 모습을 발견할 수 있어요!
            </Text>
          </View>
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
    marginBottom: 24,
    alignItems: 'center',
  },
  day: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B9080',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D5F4C',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B9080',
    textAlign: 'center',
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
    marginTop: 8,
  },
  sellyMessage: {
    fontSize: 15,
    color: '#2D5F4C',
    textAlign: 'center',
    lineHeight: 22,
  },
  badgeContainer: {
    marginTop: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  badgeIcon: {
    fontSize: 20,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D5F4C',
  },
  achievementsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D5F4C',
    marginBottom: 16,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D5F4C',
    marginBottom: 4,
  },
  achievementValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B9080',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#A0B5AC',
    textAlign: 'center',
  },
  messageSection: {
    backgroundColor: '#E8F4EF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#D4E4DC',
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5F4C',
    marginBottom: 12,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 15,
    color: '#6B9080',
    lineHeight: 22,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#2D5F4C',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  startButtonEmoji: {
    fontSize: 20,
  },
  expInfo: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#D4E4DC',
  },
  expText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D5F4C',
    marginBottom: 4,
  },
  expSubtext: {
    fontSize: 13,
    color: '#A0B5AC',
    textAlign: 'center',
  },
});

export default Day7Completion;
