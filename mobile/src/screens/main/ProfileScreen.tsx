/**
 * Profile Screen - 프로필
 * 사용자 정보, 설정, 통계를 보여주는 화면
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
import { useUserStore } from '../../store/userStore';
import { useSellyStore } from '../../store/sellyStore';
import { useEmotionStore } from '../../store/emotionStore';
import { useRoutineStore } from '../../store/routineStore';
import { useSurveyStore } from '../../store/surveyStore';
import SellyAvatar from '../../components/selly/SellyAvatar';

type Props = MainTabScreenProps<'Profile'>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const userStore = useUserStore();
  const sellyStore = useSellyStore();
  const emotionStore = useEmotionStore();
  const routineStore = useRoutineStore();
  const surveyStore = useSurveyStore();

  const user = userStore.user;

  const handleSettingPress = (title: string) => {
    Alert.alert(title, '이 기능은 추후 업데이트에서 제공될 예정입니다.');
  };

  const handleLogout = () => {
    Alert.alert('로그아웃', '로그아웃 기능은 추후 구현됩니다.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 프로필 헤더 */}
        <View style={styles.profileHeader}>
          <View style={styles.sellyContainer}>
            <SellyAvatar
              stage={sellyStore.stage}
              style={sellyStore.style}
              size="large"
              showProgress
              progress={sellyStore.progress}
            />
          </View>
          <Text style={styles.userName}>{user?.name || '사용자'}</Text>
          <Text style={styles.userInfo}>
            {user?.age || 0}세 • {user?.isHSP ? 'HSP' : '일반'}
          </Text>
        </View>

        {/* 통계 섹션 */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>나의 활동</Text>
          <View style={styles.statsGrid}>
            <StatCard icon="💭" label="감정 기록" value={emotionStore.logs.length} />
            <StatCard icon="🧘" label="루틴 완료" value={routineStore.completedRoutines.length} />
            <StatCard icon="📊" label="설문 완료" value={surveyStore.results.length} />
            <StatCard icon="🔥" label="연속 기록" value={emotionStore.currentStreak} />
          </View>

          {/* 경험치 바 */}
          <View style={styles.expSection}>
            <View style={styles.expHeader}>
              <Text style={styles.expLabel}>경험치</Text>
              <Text style={styles.expValue}>{sellyStore.experience} XP</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(sellyStore.progress * 100, 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.expSubtext}>
              다음 단계까지 {sellyStore.experienceToNextStage} XP
            </Text>
          </View>
        </View>

        {/* 설정 섹션 */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>설정</Text>

          <SettingItem
            icon="👤"
            label="프로필 수정"
            onPress={() => handleSettingPress('프로필 수정')}
          />
          <SettingItem
            icon="🔔"
            label="알림 설정"
            onPress={() => handleSettingPress('알림 설정')}
          />
          <SettingItem
            icon="🎨"
            label="테마 설정"
            onPress={() => handleSettingPress('테마 설정')}
          />
          <SettingItem
            icon="📱"
            label="건강 앱 연동"
            onPress={() => handleSettingPress('건강 앱 연동')}
          />
          <SettingItem
            icon="🔒"
            label="개인정보 보호"
            onPress={() => handleSettingPress('개인정보 보호')}
          />
          <SettingItem
            icon="ℹ️"
            label="앱 정보"
            onPress={() => handleSettingPress('앱 정보')}
          />
        </View>

        {/* 로그아웃 버튼 */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>

        {/* 버전 정보 */}
        <Text style={styles.versionText}>SELLERY v1.0.0 MVP</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

// 통계 카드
const StatCard: React.FC<{
  icon: string;
  label: string;
  value: number;
}> = ({ icon, label, value }) => {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
};

// 설정 아이템
const SettingItem: React.FC<{
  icon: string;
  label: string;
  onPress: () => void;
}> = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.settingIcon}>{icon}</Text>
      <Text style={styles.settingLabel}>{label}</Text>
      <Text style={styles.settingArrow}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9F7',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 32,
    backgroundColor: '#E8F4EF',
  },
  sellyContainer: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5F4C',
    marginBottom: 4,
  },
  userInfo: {
    fontSize: 14,
    color: '#6B9080',
  },
  statsSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D5F4C',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
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
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5F4C',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B9080',
  },
  expSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  expLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D5F4C',
  },
  expValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B9080',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E8F4EF',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2D5F4C',
    borderRadius: 6,
  },
  expSubtext: {
    fontSize: 13,
    color: '#A0B5AC',
    textAlign: 'center',
  },
  settingsSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    color: '#2D5F4C',
  },
  settingArrow: {
    fontSize: 24,
    color: '#A0B5AC',
  },
  logoutButton: {
    marginHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8F4EF',
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B9080',
  },
  versionText: {
    fontSize: 12,
    color: '#A0B5AC',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ProfileScreen;
