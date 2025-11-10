/**
 * Home Screen - 정원 뷰
 * 셀리와 감정 로그를 보여주는 메인 화면
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { MainTabScreenProps } from '../../navigation/types';
import { useSellyStore } from '../../store/sellyStore';
import { useEmotionStore } from '../../store/emotionStore';
import { useUserStore } from '../../store/userStore';
import SellyAvatar from '../../components/selly/SellyAvatar';
import { EmotionLog } from '../../types/emotion';

type Props = MainTabScreenProps<'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const sellyStore = useSellyStore();
  const emotionStore = useEmotionStore();
  const userStore = useUserStore();
  const [showEmotionModal, setShowEmotionModal] = useState(false);

  // 최근 7일 감정 로그
  const recentLogs = emotionStore.logs
    .slice(-7)
    .reverse()
    .slice(0, 3);

  // 오늘 날짜
  const today = new Date().toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const handleAddEmotion = () => {
    setShowEmotionModal(true);
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>안녕하세요!</Text>
            <Text style={styles.userName}>{userStore.user?.name || '사용자'}님</Text>
          </View>
          <Text style={styles.date}>{today}</Text>
        </View>

        {/* 정원 - 셀리 */}
        <View style={styles.gardenSection}>
          <Text style={styles.sectionTitle}>나의 정원</Text>
          <View style={styles.gardenContainer}>
            <View style={styles.garden}>
              <SellyAvatar
                stage={sellyStore.stage}
                style={sellyStore.style}
                size="large"
                showProgress
                progress={sellyStore.progress}
              />
              <View style={styles.sellyInfo}>
                <Text style={styles.sellyName}>셀리</Text>
                <Text style={styles.sellyExp}>
                  {sellyStore.experience} XP
                </Text>
              </View>
            </View>

            {/* 셀리 메시지 */}
            <View style={styles.speechBubble}>
              <Text style={styles.sellyMessage}>
                {getSellyMessage(emotionStore.logs.length)}
              </Text>
            </View>
          </View>
        </View>

        {/* 오늘의 감정 */}
        <View style={styles.emotionSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>최근 감정</Text>
            <TouchableOpacity onPress={handleAddEmotion} style={styles.addButton}>
              <Text style={styles.addButtonText}>+ 기록하기</Text>
            </TouchableOpacity>
          </View>

          {recentLogs.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📝</Text>
              <Text style={styles.emptyText}>아직 감정 기록이 없어요</Text>
              <Text style={styles.emptySubtext}>
                오늘의 감정을 기록해보세요
              </Text>
            </View>
          ) : (
            <View style={styles.emotionList}>
              {recentLogs.map((log) => (
                <EmotionCard key={log.id} log={log} />
              ))}
            </View>
          )}
        </View>

        {/* 통계 카드 */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>이번 주 활동</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="💭"
              label="감정 기록"
              value={emotionStore.logs.length}
              unit="회"
            />
            <StatCard
              icon="🔥"
              label="연속 기록"
              value={emotionStore.currentStreak}
              unit="일"
            />
          </View>
        </View>
      </ScrollView>

      {/* 감정 기록 모달 (추후 구현) */}
      <Modal
        visible={showEmotionModal}
        animationType="slide"
        onRequestClose={() => setShowEmotionModal(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>감정 기록하기</Text>
            <TouchableOpacity onPress={() => setShowEmotionModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.modalPlaceholder}>
              감정 기록 화면은 추후 구현됩니다
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

// 감정 카드 컴포넌트
const EmotionCard: React.FC<{ log: EmotionLog }> = ({ log }) => {
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.emotionCard}>
      <View style={[styles.emotionColorBar, { backgroundColor: log.color }]} />
      <View style={styles.emotionContent}>
        <View style={styles.emotionHeader}>
          <Text style={styles.emotionEmoji}>{log.emoji}</Text>
          <Text style={styles.emotionDate}>
            {formatDate(log.date)} {formatTime(log.date)}
          </Text>
        </View>
        <Text style={styles.emotionText} numberOfLines={2}>
          {log.text}
        </Text>
        <View style={styles.emotionFooter}>
          <Text style={styles.emotionTemp}>🌡️ {log.temperature}°</Text>
        </View>
      </View>
    </View>
  );
};

// 통계 카드 컴포넌트
const StatCard: React.FC<{
  icon: string;
  label: string;
  value: number;
  unit: string;
}> = ({ icon, label, value, unit }) => {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>
        {value}
        <Text style={styles.statUnit}>{unit}</Text>
      </Text>
    </View>
  );
};

// 셀리 메시지 생성
const getSellyMessage = (logCount: number): string => {
  if (logCount === 0) {
    return '오늘의 감정을 기록해볼까? 💚';
  } else if (logCount < 3) {
    return '좋아! 계속 함께 해줘서 고마워 🌱';
  } else if (logCount < 7) {
    return '우리 벌써 이렇게 자랐어! 🌸';
  } else {
    return '너와 함께여서 정말 행복해! 💚';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9F7',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#6B9080',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5F4C',
  },
  date: {
    fontSize: 13,
    color: '#A0B5AC',
  },
  gardenSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D5F4C',
    marginBottom: 16,
  },
  gardenContainer: {
    backgroundColor: '#E8F4EF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  garden: {
    alignItems: 'center',
    marginBottom: 16,
  },
  sellyInfo: {
    alignItems: 'center',
    marginTop: 12,
  },
  sellyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D5F4C',
    marginBottom: 4,
  },
  sellyExp: {
    fontSize: 14,
    color: '#6B9080',
  },
  speechBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#2D5F4C',
    width: '100%',
  },
  sellyMessage: {
    fontSize: 15,
    color: '#2D5F4C',
    textAlign: 'center',
    lineHeight: 22,
  },
  emotionSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#2D5F4C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D5F4C',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#A0B5AC',
  },
  emotionList: {
    gap: 12,
  },
  emotionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emotionColorBar: {
    width: 6,
  },
  emotionContent: {
    flex: 1,
    padding: 16,
  },
  emotionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  emotionEmoji: {
    fontSize: 24,
  },
  emotionDate: {
    fontSize: 12,
    color: '#A0B5AC',
  },
  emotionText: {
    fontSize: 15,
    color: '#2D5F4C',
    lineHeight: 22,
    marginBottom: 8,
  },
  emotionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emotionTemp: {
    fontSize: 13,
    color: '#6B9080',
  },
  statsSection: {
    paddingHorizontal: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B9080',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5F4C',
  },
  statUnit: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#A0B5AC',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F9F7',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F4EF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D5F4C',
  },
  closeButton: {
    fontSize: 24,
    color: '#6B9080',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalPlaceholder: {
    fontSize: 16,
    color: '#A0B5AC',
    textAlign: 'center',
  },
});

export default HomeScreen;
