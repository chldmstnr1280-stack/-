/**
 * Routine Screen - 루틴 목록
 * 명상, 호흡법, 활동 루틴을 보여주고 실행하는 화면
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
  Alert,
} from 'react-native';
import { MainTabScreenProps } from '../../navigation/types';
import { useRoutineStore, rewardRoutineComplete } from '../../store/sellyStore';
import { useSellyStore } from '../../store/sellyStore';
import BreathingTimer from '../../components/routine/BreathingTimer';
import {
  MEDITATION_ROUTINES,
  BREATHING_PATTERNS,
  ACTIVITY_ROUTINES,
} from '../../constants/routines';
import { Routine, BreathingPattern } from '../../types/routine';

type Props = MainTabScreenProps<'Routine'>;

type RoutineCategory = 'all' | 'meditation' | 'breathing' | 'activity';

const RoutineScreen: React.FC<Props> = ({ navigation }) => {
  const routineStore = useRoutineStore();
  const sellyStore = useSellyStore();
  const [selectedCategory, setSelectedCategory] = useState<RoutineCategory>('all');
  const [selectedBreathing, setSelectedBreathing] = useState<BreathingPattern | null>(null);
  const [showBreathingModal, setShowBreathingModal] = useState(false);

  const categories: { id: RoutineCategory; label: string; icon: string }[] = [
    { id: 'all', label: '전체', icon: '📋' },
    { id: 'meditation', label: '명상', icon: '🧘' },
    { id: 'breathing', label: '호흡법', icon: '🌬️' },
    { id: 'activity', label: '활동', icon: '🚶' },
  ];

  const handleRoutinePress = (routine: Routine) => {
    Alert.alert(routine.name, `${routine.description}\n\n⏱️ ${Math.floor(routine.duration / 60)}분`, [
      { text: '취소', style: 'cancel' },
      {
        text: '시작하기',
        onPress: () => handleStartRoutine(routine),
      },
    ]);
  };

  const handleBreathingPress = (breathing: BreathingPattern) => {
    setSelectedBreathing(breathing);
    setShowBreathingModal(true);
  };

  const handleStartRoutine = (routine: Routine) => {
    routineStore.startRoutine(routine.id, 'temp_user');

    Alert.alert('루틴 시작', `${routine.name}을(를) 시작합니다!\n편안한 자세로 준비하세요.`, [
      {
        text: '확인',
        onPress: () => {
          setTimeout(() => {
            handleRoutineComplete(routine);
          }, 1000);
        },
      },
    ]);
  };

  const handleRoutineComplete = (routine: Routine) => {
    routineStore.completeRoutine(5);
    const evolved = rewardRoutineComplete();

    if (evolved) {
      Alert.alert('🌸 셀리가 성장했어요!', `${routine.name}을(를) 완료했어요!\n셀리가 더 자랐어요!`);
    } else {
      Alert.alert('완료! 💚', `${routine.name}을(를) 성공적으로 완료했어요!`);
    }
  };

  const handleBreathingComplete = () => {
    setShowBreathingModal(false);

    if (selectedBreathing) {
      routineStore.completeRoutine(5);
      const evolved = rewardRoutineComplete();

      if (evolved) {
        Alert.alert('🌸 셀리가 성장했어요!', '호흡법을 완료했어요!\n셀리가 더 자랐어요!');
      } else {
        Alert.alert('완료! 💚', '호흡법을 성공적으로 완료했어요!');
      }
    }
  };

  const handleBreathingCancel = () => {
    setShowBreathingModal(false);
    setSelectedBreathing(null);
  };

  // 카테고리별 루틴 필터링
  const getFilteredRoutines = () => {
    const allRoutines: Routine[] = [...MEDITATION_ROUTINES, ...ACTIVITY_ROUTINES];

    if (selectedCategory === 'all') {
      return allRoutines;
    } else if (selectedCategory === 'meditation') {
      return MEDITATION_ROUTINES;
    } else if (selectedCategory === 'activity') {
      return ACTIVITY_ROUTINES;
    }
    return [];
  };

  const filteredRoutines = getFilteredRoutines();
  const showBreathingPatterns =
    selectedCategory === 'all' || selectedCategory === 'breathing';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>루틴</Text>
        <Text style={styles.subtitle}>마음을 돌보는 시간</Text>
      </View>

      {/* 카테고리 필터 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
            activeOpacity={0.7}>
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text
              style={[
                styles.categoryLabel,
                selectedCategory === category.id && styles.categoryLabelActive,
              ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 루틴 리스트 */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 호흡법 섹션 */}
        {showBreathingPatterns && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌬️ 호흡법</Text>
            {BREATHING_PATTERNS.map((breathing) => (
              <TouchableOpacity
                key={breathing.id}
                style={styles.routineCard}
                onPress={() => handleBreathingPress(breathing)}
                activeOpacity={0.7}>
                <Text style={styles.routineIcon}>💨</Text>
                <View style={styles.routineInfo}>
                  <Text style={styles.routineName}>{breathing.name}</Text>
                  <Text style={styles.routineDescription}>{breathing.description}</Text>
                  <Text style={styles.routineDuration}>🔄 {breathing.cycles} 사이클</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 일반 루틴 섹션 */}
        {filteredRoutines.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'meditation'
                ? '🧘 명상'
                : selectedCategory === 'activity'
                ? '🚶 활동'
                : '📋 모든 루틴'}
            </Text>
            {filteredRoutines.map((routine) => (
              <TouchableOpacity
                key={routine.id}
                style={styles.routineCard}
                onPress={() => handleRoutinePress(routine)}
                activeOpacity={0.7}>
                <Text style={styles.routineIcon}>{routine.icon}</Text>
                <View style={styles.routineInfo}>
                  <View style={styles.routineHeader}>
                    <Text style={styles.routineName}>{routine.name}</Text>
                    {routine.isPremium && (
                      <View style={styles.premiumBadge}>
                        <Text style={styles.premiumText}>프리미엄</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.routineDescription}>{routine.description}</Text>
                  <Text style={styles.routineDuration}>
                    ⏱️ {Math.floor(routine.duration / 60)}분
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 통계 */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>이번 주 활동</Text>
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>완료한 루틴</Text>
              <Text style={styles.statValue}>{routineStore.completedRoutines.length}회</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>평균 점수</Text>
              <Text style={styles.statValue}>
                {routineStore.completedRoutines.length > 0
                  ? (
                      routineStore.completedRoutines.reduce((sum, r) => sum + r.rating, 0) /
                      routineStore.completedRoutines.length
                    ).toFixed(1)
                  : '0'}
                /5
              </Text>
            </View>
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D5F4C',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B9080',
  },
  categoryScroll: {
    maxHeight: 50,
    marginBottom: 16,
  },
  categoryContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E8F4EF',
  },
  categoryChipActive: {
    backgroundColor: '#2D5F4C',
    borderColor: '#2D5F4C',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B9080',
  },
  categoryLabelActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
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
  routineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  routineName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D5F4C',
    flex: 1,
  },
  premiumBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  premiumText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2D5F4C',
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
  statsSection: {
    marginBottom: 16,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F4EF',
  },
  statLabel: {
    fontSize: 15,
    color: '#6B9080',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5F4C',
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

export default RoutineScreen;
