/**
 * Tracking Screen
 *
 * Step counting and cycle tracking in one unified screen
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useStepStore } from '../../src/stores/stepStore';
import { useCycleStore } from '../../src/stores/cycleStore';
import type { CyclePhase } from '../../src/types/phase2';

type TabType = 'steps' | 'cycle';

export default function TrackingScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('steps');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (activeTab === 'steps') {
      await stepStore.refreshSteps();
    } else {
      await cycleStore.refreshCycle();
    }
    setRefreshing(false);
  };

  // Import stores
  const stepStore = useStepStore();
  const cycleStore = useCycleStore();

  useEffect(() => {
    stepStore.refreshSteps();
    cycleStore.refreshCycle();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Health Tracking</Text>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'steps' && styles.tabActive]}
          onPress={() => setActiveTab('steps')}
        >
          <Text style={[styles.tabText, activeTab === 'steps' && styles.tabTextActive]}>
            🚶 Steps
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'cycle' && styles.tabActive]}
          onPress={() => setActiveTab('cycle')}
        >
          <Text style={[styles.tabText, activeTab === 'cycle' && styles.tabTextActive]}>
            🌸 Cycle
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {activeTab === 'steps' ? (
          <StepsSection store={stepStore} />
        ) : (
          <CycleSection store={cycleStore} />
        )}
      </ScrollView>
    </View>
  );
}

// Steps Section Component
function StepsSection({ store }: { store: ReturnType<typeof useStepStore> }) {
  const [stepInput, setStepInput] = useState('');

  const handleLogSteps = async () => {
    const stepCount = parseInt(stepInput, 10);

    if (isNaN(stepCount) || stepCount < 0) {
      Alert.alert('Invalid Input', 'Please enter a valid step count');
      return;
    }

    const success = await store.logSteps(stepCount);
    if (success) {
      Alert.alert('Success!', `Logged ${stepCount} steps`);
      setStepInput('');
    } else if (store.error) {
      Alert.alert('Error', store.error);
    }
  };

  const getStepBonus = () => {
    return store.todaySteps >= 8000 ? 3 : 0;
  };

  return (
    <View style={styles.section}>
      {/* Today's Steps Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Steps</Text>
        <Text style={styles.largeNumber}>{store.todaySteps.toLocaleString()}</Text>
        {getStepBonus() > 0 && (
          <View style={styles.bonusBadge}>
            <Text style={styles.bonusText}>+{getStepBonus()} Bonus Points! 🎉</Text>
          </View>
        )}
        <Text style={styles.helperText}>
          {store.todaySteps >= 8000
            ? 'Amazing! You hit your goal!'
            : `${(8000 - store.todaySteps).toLocaleString()} steps to bonus`}
        </Text>
      </View>

      {/* Log Steps Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Log Steps Manually</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter step count"
          keyboardType="number-pad"
          value={stepInput}
          onChangeText={setStepInput}
        />
        <TouchableOpacity
          style={[styles.button, store.isLoading && styles.buttonDisabled]}
          onPress={handleLogSteps}
          disabled={store.isLoading}
        >
          <Text style={styles.buttonText}>
            {store.isLoading ? 'Logging...' : 'Log Steps'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Weekly Stats */}
      {store.weeklyStats && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {store.weeklyStats.totalSteps.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Total Steps</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Math.round(store.weeklyStats.avgStepsPerDay).toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Avg / Day</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{store.weeklyStats.daysWithSteps}</Text>
              <Text style={styles.statLabel}>Active Days</Text>
            </View>
          </View>

          {/* Daily Breakdown */}
          <View style={styles.dailyList}>
            {store.weeklyStats.dailySteps.map((day, index) => (
              <View key={index} style={styles.dailyItem}>
                <Text style={styles.dailyDate}>
                  {new Date(day.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
                <View style={styles.dailyBar}>
                  <View
                    style={[
                      styles.dailyBarFill,
                      {
                        width: `${Math.min((day.stepCount / 10000) * 100, 100)}%`,
                        backgroundColor: day.stepCount >= 8000 ? '#4CAF50' : '#6B9F7D',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.dailyValue}>{day.stepCount.toLocaleString()}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {store.error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{store.error}</Text>
        </View>
      )}
    </View>
  );
}

// Cycle Section Component
function CycleSection({ store }: { store: ReturnType<typeof useCycleStore> }) {
  const [selectedPhase, setSelectedPhase] = useState<CyclePhase | null>(null);

  const handleLogCycle = async () => {
    const success = await store.logCycle(selectedPhase);
    if (success) {
      Alert.alert('Success!', `Logged cycle phase: ${selectedPhase || 'none'}`);
    } else if (store.error) {
      Alert.alert('Error', store.error);
    }
  };

  const getCycleBonus = () => {
    return store.currentPhase !== null ? 1 : 0;
  };

  const phases: Array<{ value: CyclePhase; label: string; emoji: string }> = [
    { value: 'menstrual', label: 'Menstrual', emoji: '🔴' },
    { value: 'follicular', label: 'Follicular', emoji: '🌱' },
    { value: 'ovulation', label: 'Ovulation', emoji: '🌸' },
    { value: 'luteal', label: 'Luteal', emoji: '🍂' },
  ];

  return (
    <View style={styles.section}>
      {/* Current Phase Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Phase</Text>
        <Text style={styles.largeText}>
          {store.currentPhase
            ? phases.find((p) => p.value === store.currentPhase)?.emoji +
              ' ' +
              phases.find((p) => p.value === store.currentPhase)?.label
            : 'Not tracking'}
        </Text>
        {getCycleBonus() > 0 && (
          <View style={styles.bonusBadge}>
            <Text style={styles.bonusText}>+{getCycleBonus()} Bonus Point! 🎉</Text>
          </View>
        )}
      </View>

      {/* Log Cycle Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Log Today's Phase</Text>
        <View style={styles.phaseGrid}>
          {phases.map((phase) => (
            <TouchableOpacity
              key={phase.value}
              style={[
                styles.phaseButton,
                selectedPhase === phase.value && styles.phaseButtonActive,
              ]}
              onPress={() => setSelectedPhase(phase.value)}
            >
              <Text style={styles.phaseEmoji}>{phase.emoji}</Text>
              <Text
                style={[
                  styles.phaseLabel,
                  selectedPhase === phase.value && styles.phaseLabelActive,
                ]}
              >
                {phase.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.button, !selectedPhase && styles.buttonDisabled]}
          onPress={handleLogCycle}
          disabled={!selectedPhase || store.isLoading}
        >
          <Text style={styles.buttonText}>
            {store.isLoading ? 'Logging...' : 'Log Phase'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Insights */}
      {store.insights && store.insights.totalCycleDays > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Emotion Insights</Text>
          <Text style={styles.helperText}>
            How your emotions correlate with cycle phases
          </Text>

          {Object.entries(store.insights.commonEmotionsByPhase).map(
            ([phase, emotions]) =>
              emotions.length > 0 && (
                <View key={phase} style={styles.insightItem}>
                  <Text style={styles.insightPhase}>
                    {phases.find((p) => p.value === phase)?.emoji} {phase}
                  </Text>
                  <Text style={styles.insightEmotions}>
                    Common: {emotions.join(', ')}
                  </Text>
                  {store.insights?.avgIntensityByPhase[phase] && (
                    <Text style={styles.insightIntensity}>
                      Avg intensity:{' '}
                      {store.insights.avgIntensityByPhase[phase].toFixed(1)}/10
                    </Text>
                  )}
                </View>
              )
          )}

          <Text style={styles.insightFooter}>
            Total cycle days tracked: {store.insights.totalCycleDays}
          </Text>
        </View>
      )}

      {store.error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{store.error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#6B9F7D',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  tabTextActive: {
    color: '#6B9F7D',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  largeNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#6B9F7D',
    textAlign: 'center',
    marginVertical: 8,
  },
  largeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#6B9F7D',
    textAlign: 'center',
    marginVertical: 16,
  },
  bonusBadge: {
    backgroundColor: '#FFB84D',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'center',
    marginTop: 8,
  },
  bonusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  helperText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#6B9F7D',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B9F7D',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
  },
  dailyList: {
    marginTop: 16,
  },
  dailyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dailyDate: {
    fontSize: 12,
    color: '#666666',
    width: 80,
  },
  dailyBar: {
    flex: 1,
    height: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  dailyBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  dailyValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
    width: 60,
    textAlign: 'right',
  },
  phaseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  phaseButton: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  phaseButtonActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#6B9F7D',
  },
  phaseEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  phaseLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  phaseLabelActive: {
    color: '#6B9F7D',
    fontWeight: '600',
  },
  insightItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  insightPhase: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  insightEmotions: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 2,
  },
  insightIntensity: {
    fontSize: 12,
    color: '#999999',
  },
  insightFooter: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    marginTop: 8,
  },
  errorCard: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#F44336',
    textAlign: 'center',
  },
});
