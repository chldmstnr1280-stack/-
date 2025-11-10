/**
 * Market Screen - 마켓
 * 프리미엄 루틴을 보여주는 화면 (IAP는 MVP에서 제외)
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MainTabScreenProps } from '../../navigation/types';
import { MEDITATION_ROUTINES, ACTIVITY_ROUTINES } from '../../constants/routines';
import { Routine } from '../../types/routine';

type Props = MainTabScreenProps<'Market'>;

const MarketScreen: React.FC<Props> = ({ navigation }) => {
  // 프리미엄 루틴 필터링
  const premiumMeditations = MEDITATION_ROUTINES.filter((r) => r.isPremium);
  const premiumActivities = ACTIVITY_ROUTINES.filter((r) => r.isPremium);
  const allPremiumRoutines = [...premiumMeditations, ...premiumActivities];

  const handleRoutinePress = (routine: Routine) => {
    Alert.alert(
      routine.name,
      `${routine.description}\n\n⏱️ ${Math.floor(routine.duration / 60)}분\n\n💡 이 루틴은 프리미엄 기능입니다.`,
      [
        { text: '확인', style: 'cancel' },
        {
          text: '자세히 보기',
          onPress: () => {
            Alert.alert(
              '프리미엄 준비 중',
              '프리미엄 기능은 추후 업데이트에서 제공될 예정입니다.\n\n더 많은 루틴과 기능을 곧 만나보실 수 있어요!'
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>마켓</Text>
        <Text style={styles.subtitle}>프리미엄 루틴 둘러보기</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 안내 배너 */}
        <View style={styles.banner}>
          <Text style={styles.bannerIcon}>✨</Text>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>프리미엄 준비 중</Text>
            <Text style={styles.bannerText}>
              더 많은 명상과 활동 루틴이{'\n'}곧 추가될 예정입니다
            </Text>
          </View>
        </View>

        {/* 프리미엄 루틴 섹션 */}
        {allPremiumRoutines.length > 0 ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🧘 프리미엄 명상</Text>
              {premiumMeditations.map((routine) => (
                <PremiumRoutineCard
                  key={routine.id}
                  routine={routine}
                  onPress={() => handleRoutinePress(routine)}
                />
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🚶 프리미엄 활동</Text>
              {premiumActivities.map((routine) => (
                <PremiumRoutineCard
                  key={routine.id}
                  routine={routine}
                  onPress={() => handleRoutinePress(routine)}
                />
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎁</Text>
            <Text style={styles.emptyTitle}>준비 중입니다</Text>
            <Text style={styles.emptyText}>
              프리미엄 콘텐츠가 곧 추가됩니다
            </Text>
          </View>
        )}

        {/* 기능 안내 */}
        <View style={styles.featureSection}>
          <Text style={styles.sectionTitle}>프리미엄으로 더 많이 경험하세요</Text>
          <View style={styles.featureList}>
            <FeatureItem
              icon="🎯"
              title="맞춤형 루틴"
              description="나에게 딱 맞는 명상과 활동"
            />
            <FeatureItem
              icon="📚"
              title="다양한 콘텐츠"
              description="100개 이상의 프리미엄 루틴"
            />
            <FeatureItem
              icon="🎵"
              title="고품질 오디오"
              description="전문가가 가이드하는 명상"
            />
            <FeatureItem
              icon="📈"
              title="상세한 분석"
              description="나의 성장을 한눈에"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// 프리미엄 루틴 카드
const PremiumRoutineCard: React.FC<{
  routine: Routine;
  onPress: () => void;
}> = ({ routine, onPress }) => {
  return (
    <TouchableOpacity style={styles.routineCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.premiumBadge}>
        <Text style={styles.premiumBadgeText}>프리미엄</Text>
      </View>
      <Text style={styles.routineIcon}>{routine.icon}</Text>
      <View style={styles.routineInfo}>
        <Text style={styles.routineName}>{routine.name}</Text>
        <Text style={styles.routineDescription}>{routine.description}</Text>
        <Text style={styles.routineDuration}>
          ⏱️ {Math.floor(routine.duration / 60)}분
        </Text>
      </View>
      <View style={styles.lockIcon}>
        <Text style={styles.lockIconText}>🔒</Text>
      </View>
    </TouchableOpacity>
  );
};

// 기능 아이템
const FeatureItem: React.FC<{
  icon: string;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  banner: {
    flexDirection: 'row',
    backgroundColor: '#E8F4EF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#6B9080',
  },
  bannerIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5F4C',
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 14,
    color: '#6B9080',
    lineHeight: 20,
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
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  premiumBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2D5F4C',
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
  lockIcon: {
    marginLeft: 8,
  },
  lockIconText: {
    fontSize: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D5F4C',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#A0B5AC',
    textAlign: 'center',
  },
  featureSection: {
    marginTop: 16,
  },
  featureList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D5F4C',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B9080',
  },
});

export default MarketScreen;
