/**
 * Day 5: Check-In Screen
 * 주간 마음 체크인 (PHQ-9 & GAD-7)
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
import { useSellyStore, rewardSurveyComplete } from '../../store/sellyStore';
import { useSurveyStore } from '../../store/surveyStore';
import SellyAvatar from '../../components/selly/SellyAvatar';
import SurveyQuestionCard from '../../components/survey/SurveyQuestionCard';
import { PHQ9_QUESTIONS, GAD7_QUESTIONS, SurveyType, getSurveyFeedback } from '../../types/survey';

type Props = OnboardingScreenProps<'Day5CheckIn'>;

type CheckInStage = 'intro' | 'phq9' | 'gad7' | 'result';

const Day5CheckIn: React.FC<Props> = ({ navigation }) => {
  const { completeStep, setCurrentDay } = useOnboardingStore();
  const sellyStore = useSellyStore();
  const { startSurvey, answerQuestion, completeSurvey, currentSurvey } = useSurveyStore();

  const [stage, setStage] = useState<CheckInStage>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [phq9Score, setPhq9Score] = useState<number | null>(null);
  const [gad7Score, setGad7Score] = useState<number | null>(null);

  const getCurrentQuestions = () => {
    if (stage === 'phq9') return PHQ9_QUESTIONS;
    if (stage === 'gad7') return GAD7_QUESTIONS;
    return [];
  };

  const currentQuestions = getCurrentQuestions();
  const currentQuestion = currentQuestions[currentQuestionIndex];

  const handleStartPHQ9 = () => {
    startSurvey(SurveyType.PHQ9);
    setStage('phq9');
    setCurrentQuestionIndex(0);
  };

  const handleAnswer = (value: number) => {
    if (!currentQuestion) return;

    answerQuestion(currentQuestion.id, value);

    // 다음 질문으로
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 설문 완료
      const result = completeSurvey('temp_user');

      if (result) {
        if (stage === 'phq9') {
          setPhq9Score(result.totalScore);
          completeStep(OnboardingStep.PHQ9_COMPLETE);

          // GAD-7로 이동
          Alert.alert(
            'PHQ-9 완료!',
            `점수: ${result.totalScore}점\n\n이제 불안감 평가(GAD-7)를 진행해요.`,
            [
              {
                text: '다음',
                onPress: () => {
                  startSurvey(SurveyType.GAD7);
                  setStage('gad7');
                  setCurrentQuestionIndex(0);
                },
              },
            ]
          );
        } else if (stage === 'gad7') {
          setGad7Score(result.totalScore);
          completeStep(OnboardingStep.GAD7_COMPLETE);
          completeStep(OnboardingStep.WEEKLY_CHECKIN);

          // 경험치 보상
          const evolved = rewardSurveyComplete();

          if (evolved) {
            Alert.alert(
              '🎉 완료!',
              `GAD-7 점수: ${result.totalScore}점\n\n셀리가 성장했어요!`,
              [
                {
                  text: '결과 보기',
                  onPress: () => setStage('result'),
                },
              ]
            );
          } else {
            setStage('result');
          }
        }
      }
    }
  };

  const handleComplete = () => {
    setCurrentDay(7);
    navigation.navigate('Day7Completion');
  };

  const selectedValue = currentSurvey.responses.find(
    r => r.questionId === currentQuestion?.id
  )?.value;

  if (stage === 'intro') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            {/* 헤더 */}
            <View style={styles.header}>
              <Text style={styles.day}>Day 5</Text>
              <Text style={styles.title}>주간 마음 체크인</Text>
              <Text style={styles.subtitle}>이번 주 마음 상태를 확인해봐요</Text>
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
                  일주일 동안 잘 해냈어!{'\n'}
                  지금 마음 상태를 체크해보자 💚
                </Text>
              </View>
            </View>

            {/* 설명 */}
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>📋 체크인 내용</Text>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>1️⃣</Text>
                <Text style={styles.infoText}>PHQ-9 (우울증 평가) - 9개 질문</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>2️⃣</Text>
                <Text style={styles.infoText}>GAD-7 (불안감 평가) - 7개 질문</Text>
              </View>

              <View style={styles.noticeBox}>
                <Text style={styles.noticeIcon}>💡</Text>
                <Text style={styles.noticeText}>
                  정직하게 답변해주세요.{'\n'}
                  개인 정보는 안전하게 보호돼요.
                </Text>
              </View>
            </View>

            {/* 시작 버튼 */}
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartPHQ9}
              activeOpacity={0.8}>
              <Text style={styles.startButtonText}>체크인 시작하기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (stage === 'phq9' || stage === 'gad7') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.surveyContent}>
          <View style={styles.surveyHeader}>
            <Text style={styles.surveyTitle}>
              {stage === 'phq9' ? 'PHQ-9 (우울증 평가)' : 'GAD-7 (불안감 평가)'}
            </Text>
            <Text style={styles.surveySubtitle}>
              지난 2주간 이러한 문제들로 인해{'\n'}
              얼마나 자주 방해를 받았나요?
            </Text>
          </View>

          <ScrollView contentContainerStyle={styles.surveyScrollContent}>
            {currentQuestion && (
              <SurveyQuestionCard
                question={currentQuestion}
                selectedValue={selectedValue}
                onSelect={handleAnswer}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={currentQuestions.length}
              />
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  // Result stage
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.title}>주간 체크인 완료! 🎉</Text>
            <Text style={styles.subtitle}>이번 주 마음 상태 결과에요</Text>
          </View>

          {/* 결과 카드 */}
          <View style={styles.resultCard}>
            <View style={styles.scoreRow}>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreLabel}>PHQ-9</Text>
                <Text style={styles.scoreValue}>{phq9Score}점</Text>
                <Text style={styles.scoreMax}>/ 27점</Text>
              </View>
              <View style={styles.scoreDivider} />
              <View style={styles.scoreItem}>
                <Text style={styles.scoreLabel}>GAD-7</Text>
                <Text style={styles.scoreValue}>{gad7Score}점</Text>
                <Text style={styles.scoreMax}>/ 21점</Text>
              </View>
            </View>

            <View style={styles.feedbackBox}>
              <Text style={styles.feedbackIcon}>💬</Text>
              <Text style={styles.feedbackText}>
                이번 주 감정 기록을 잘 완료했어요!{'\n'}
                꾸준히 기록하면 패턴을 발견할 수 있어요.
              </Text>
            </View>
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
                일주일 동안 함께해줘서 고마워!{'\n'}
                앞으로도 함께 성장하자 💚
              </Text>
            </View>
          </View>

          {/* 완료 버튼 */}
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}
            activeOpacity={0.8}>
            <Text style={styles.completeButtonText}>다음</Text>
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
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D5F4C',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    color: '#2D5F4C',
  },
  noticeBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    gap: 12,
  },
  noticeIcon: {
    fontSize: 20,
  },
  noticeText: {
    flex: 1,
    fontSize: 14,
    color: '#6B5D00',
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#2D5F4C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  surveyContent: {
    flex: 1,
  },
  surveyHeader: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  surveyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5F4C',
    marginBottom: 8,
  },
  surveySubtitle: {
    fontSize: 15,
    color: '#6B9080',
    lineHeight: 22,
  },
  surveyScrollContent: {
    padding: 24,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B9080',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2D5F4C',
  },
  scoreMax: {
    fontSize: 14,
    color: '#A0B5AC',
  },
  scoreDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  feedbackBox: {
    flexDirection: 'row',
    backgroundColor: '#E8F4EF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  feedbackIcon: {
    fontSize: 24,
  },
  feedbackText: {
    flex: 1,
    fontSize: 15,
    color: '#2D5F4C',
    lineHeight: 22,
  },
  completeButton: {
    backgroundColor: '#2D5F4C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Day5CheckIn;
