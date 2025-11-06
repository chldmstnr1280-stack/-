import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { api } from '../../src/api/client';
import { WeeklyStats } from '../../src/types';

export default function ReportScreen() {
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = async () => {
    try {
      const data = await api.getWeeklyReport();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!stats || stats.daysLogged === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📊</Text>
        <Text style={styles.emptyText}>No data yet</Text>
        <Text style={styles.emptySubtext}>
          Start logging emotions to see your weekly report!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Last 7 Days</Text>

        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{stats.daysLogged}</Text>
            <Text style={styles.summaryLabel}>Days Logged</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{stats.avgIntensity.toFixed(1)}</Text>
            <Text style={styles.summaryLabel}>Avg Intensity</Text>
          </View>
        </View>

        {/* Top Emotions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Emotions</Text>
          {stats.topEmotions.map((item, index) => (
            <View key={item.emotion} style={styles.topEmotionItem}>
              <View style={styles.topEmotionRank}>
                <Text style={styles.topEmotionRankText}>{index + 1}</Text>
              </View>
              <View style={styles.topEmotionInfo}>
                <Text style={styles.topEmotionLabel}>{item.emotion}</Text>
                <View style={styles.topEmotionBar}>
                  <View
                    style={[
                      styles.topEmotionBarFill,
                      {
                        width: `${(item.count / stats.topEmotions[0].count) * 100}%`,
                      },
                    ]}
                  />
                </View>
              </View>
              <Text style={styles.topEmotionCount}>{item.count}</Text>
            </View>
          ))}
        </View>

        {/* Daily Trend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Trend</Text>
          <View style={styles.chartContainer}>
            {stats.dailyTrend.map((day) => (
              <View key={day.date} style={styles.chartBar}>
                <View
                  style={[
                    styles.chartBarFill,
                    { height: `${(day.avgIntensity / 10) * 100}%` },
                  ]}
                />
                <Text style={styles.chartBarLabel}>
                  {new Date(day.date).getDate()}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.chartAxis}>
            <Text style={styles.chartAxisLabel}>0</Text>
            <Text style={styles.chartAxisLabel}>10</Text>
          </View>
        </View>

        {/* Insights */}
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>💡 Insights</Text>
          <Text style={styles.insightText}>
            You logged emotions on {stats.daysLogged} days this week.
            {stats.avgIntensity < 5
              ? ' Your emotions were mostly on the calmer side.'
              : ' You experienced some intense emotions.'}
          </Text>
          {stats.topEmotions.length > 0 && (
            <Text style={styles.insightText}>
              Your most common emotion was "{stats.topEmotions[0].emotion}".
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 25,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 15,
  },
  topEmotionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  topEmotionRank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  topEmotionRankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  topEmotionInfo: {
    flex: 1,
  },
  topEmotionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  topEmotionBar: {
    height: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  topEmotionBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  topEmotionCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginLeft: 10,
    minWidth: 30,
    textAlign: 'right',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 150,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  chartBarFill: {
    width: '100%',
    backgroundColor: '#4CAF50',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 5,
  },
  chartBarLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  chartAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  chartAxisLabel: {
    fontSize: 12,
    color: '#999',
  },
  insightCard: {
    backgroundColor: '#FFF9C4',
    borderRadius: 15,
    padding: 20,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F57F17',
    marginBottom: 10,
  },
  insightText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
});
