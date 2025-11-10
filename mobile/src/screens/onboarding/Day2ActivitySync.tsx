/**
 * Day 2: Activity Sync Screen
 * 활동 데이터 연동 화면
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
  ActivityIndicator,
} from 'react-native';
import { OnboardingScreenProps } from '../../navigation/types';
import { OnboardingStep } from '../../types/onboarding';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useSellyStore, rewardDailyStreak } from '../../store/sellyStore';
import HealthService from '../../services/health';
import { HealthData } from '../../services/health/appleHealth';
import SellyAvatar from '../../components/selly/SellyAvatar';

type Props = OnboardingScreenProps<'Day2ActivitySync'>;

const Day2ActivitySync: React.FC<Props> = ({ navigation }) => {
  const { completeStep, setCurrentDay } = useOnboardingStore();
  const sellyStore = useSellyStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [healthData, setHealthData] = useState<HealthData | null>(null);

  const platformName = HealthService.getPlatformName();

  const handleConnect = async () => {
    setIsLoading(true);

    try {
      // 사용 가능 여부 확인
      const available = await HealthService.isAvailable();

      if (!available) {
        Alert.alert(
          '알림',
          `${platformName}을 사용할 수 없습니다.\n설정에서 권한을 확인해주세요.`
        );
        setIsLoading(false);
        return;
      }

      // 권한 요청
      const permissions = await HealthService.requestPermissions();

      if (!permissions.steps && !permissions.sleep) {
        Alert.alert(
          '권한 필요',
          `${platformName} 데이터를 읽으려면 권한이 필요해요.\n설정에서 권한을 허용해주세요.`
        );
        setIsLoading(false);
        return;
      }

      // 데이터 가져오기
      const data = await HealthService.getTodayData();
      setHealthData(data);
      setIsConnected(true);

      // 셀리 경험치 보상
      rewardDailyStreak();

      Alert.alert('성공! 🎉', `${platformName}와 연동되었어요!`);
    } catch (error) {
      console.error('Health sync error:', error);
      Alert.alert('오류', '연동 중 문제가 발생했어요. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      '건너뛰기',
      '지금 건너뛰면 나중에 설정에서 연동할 수 있어요.\n계속하시겠어요?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '건너뛰기',
          onPress: () => {
            completeStep(OnboardingStep.ACTIVITY_SYNC);
            setCurrentDay(3);
            navigation.navigate('Day3Routine');
          },
        },
      ]
    );
  };

  const handleNext = () => {
    if (!isConnected) {
      Alert.alert('알림', '먼저 활동 데이터를 연동해주세요');
      return;
    }

    completeStep(OnboardingStep.ACTIVITY_SYNC);
    completeStep(OnboardingStep.SELLY_SPROUT);
    setCurrentDay(3);

    // TODO: Show evolution animation
    Alert.alert(
      '🌱 셀리가 자랐어요!',
      '셀리가 새싹으로 성장했어요!\n매일 감정과 활동을 기록하면 더 자랄 거예요!',
      [
        {
          text: '확인',
          onPress: () => {
            navigation.navigate('Day3Routine');
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
            <Text style={styles.day}>Day 2</Text>
            <Text style={styles.title}>활동 데이터 연동</Text>
            <Text style={styles.subtitle}>
              감정과 신체 활동의 관계를 발견해봐요
            </Text>
          </View>

          {/* 셀리 표시 */}
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
                {isConnected
                  ? `오늘 ${healthData?.steps}걸음이나 걸었네!\n잘하고 있어! 💚`
                  : `${platformName}와 연동하면\n더 정확한 인사이트를 줄 수 있어! 🌱`}
              </Text>
            </View>
          </View>

          {/* 연동 카드 */}
          {!isConnected ? (
            <View style={styles.connectCard}>
              <Text style={styles.connectIcon}>📱</Text>
              <Text style={styles.connectTitle}>{platformName}</Text>
              <Text style={styles.connectDescription}>
                걸음 수, 수면 시간 등{'\n'}
                신체 활동 데이터를 자동으로 수집해요
              </Text>

              <TouchableOpacity
                style={styles.connectButton}
                onPress={handleConnect}
                disabled={isLoading}
                activeOpacity={0.8}>
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.connectButtonText}>연동하기</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipButtonText}>나중에 하기</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.dataCard}>
              <Text style={styles.dataTitle}>오늘의 활동</Text>

              <View style={styles.dataGrid}>
                <View style={styles.dataItem}>
                  <Text style={styles.dataIcon}>👣</Text>
                  <Text style={styles.dataValue}>
                    {healthData?.steps.toLocaleString()}
                  </Text>
                  <Text style={styles.dataLabel}>걸음</Text>
                </View>

                <View style={styles.dataItem}>
                  <Text style={styles.dataIcon}>😴</Text>
                  <Text style={styles.dataValue}>{healthData?.sleepHours}h</Text>
                  <Text style={styles.dataLabel}>수면</Text>
                </View>

                {healthData?.heartRate && (
                  <View style={styles.dataItem}>
                    <Text style={styles.dataIcon}>❤️</Text>
                    <Text style={styles.dataValue}>{healthData.heartRate}</Text>
                    <Text style={styles.dataLabel}>심박수</Text>
                  </View>
                )}
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoIcon}>💡</Text>
                <Text style={styles.infoText}>
                  활동 데이터는 감정 기록과 함께 저장되어{'\n'}
                  패턴 분석에 활용돼요
                </Text>
              </View>

              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
                activeOpacity={0.8}>
                <Text style={styles.nextButtonText}>다음</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 안내 */}
          {!isConnected && (
            <View style={styles.benefitsSection}>
              <Text style={styles.benefitsTitle}>연동하면 좋은 점</Text>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>✓</Text>
                <Text style={styles.benefitText}>감정과 활동의 상관관계 분석</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>✓</Text>
                <Text style={styles.benefitText}>자동으로 데이터 수집 (수동 입력 불필요)</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>✓</Text>
                <Text style={styles.benefitText}>더 정확한 주간 리포트</Text>
              </View>
            </View>
          )}
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
  connectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  connectIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  connectTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5F4C',
    marginBottom: 8,
  },
  connectDescription: {
    fontSize: 15,
    color: '#6B9080',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  connectButton: {
    backgroundColor: '#2D5F4C',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
    marginBottom: 12,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    color: '#6B9080',
    fontSize: 15,
    fontWeight: '500',
  },
  dataCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  dataTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D5F4C',
    marginBottom: 20,
    textAlign: 'center',
  },
  dataGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  dataItem: {
    alignItems: 'center',
  },
  dataIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  dataValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5F4C',
    marginBottom: 4,
  },
  dataLabel: {
    fontSize: 13,
    color: '#6B9080',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  infoIcon: {
    fontSize: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#6B5D00',
    lineHeight: 20,
  },
  nextButton: {
    backgroundColor: '#2D5F4C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  benefitsSection: {
    backgroundColor: '#E8F4EF',
    borderRadius: 16,
    padding: 20,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D5F4C',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  benefitIcon: {
    fontSize: 16,
    color: '#2D5F4C',
    fontWeight: 'bold',
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: '#2D5F4C',
  },
});

export default Day2ActivitySync;
