/**
 * AI Insights Screen
 *
 * Display daily personalized insights and coping strategies
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useAIStore } from '../../src/stores/aiStore';
import { format } from 'date-fns';

export default function InsightsScreen() {
  const {
    todayInsight,
    isInsightLoading,
    insightError,
    generateInsight,
    fetchTodayInsight,
  } = useAIStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTodayInsight();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTodayInsight();
    setRefreshing(false);
  };

  const handleGenerateInsight = () => {
    if (todayInsight) {
      Alert.alert(
        'Insight Already Generated',
        'You already have an insight for today. A new insight will be available tomorrow!',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Generate Daily Insight',
      'Create a personalized insight based on your recent emotions and activities?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: async () => {
            const success = await generateInsight();
            if (success) {
              Alert.alert('Success!', 'Your daily insight has been generated!');
            } else if (insightError) {
              Alert.alert('Generation Failed', insightError);
            }
          },
        },
      ]
    );
  };

  const renderStrategyIcon = (index: number): string => {
    const icons = ['💪', '🧠', '🤝', '🎨', '💼'];
    return icons[index % icons.length];
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Daily Insights</Text>
        {!todayInsight && !isInsightLoading && (
          <TouchableOpacity onPress={handleGenerateInsight}>
            <Text style={styles.generateButton}>Generate</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {isInsightLoading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6B9F7D" />
            <Text style={styles.loadingText}>Generating your insight...</Text>
            <Text style={styles.loadingSubtext}>
              Analyzing your emotions and patterns
            </Text>
          </View>
        ) : insightError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{insightError}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchTodayInsight}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : !todayInsight ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>✨</Text>
            <Text style={styles.emptyTitle}>No Insight Yet</Text>
            <Text style={styles.emptyText}>
              Generate your daily insight to receive personalized emotional wellness guidance
              based on your recent activities and emotions.
            </Text>
            <TouchableOpacity style={styles.generateLargeButton} onPress={handleGenerateInsight}>
              <Text style={styles.generateLargeButtonText}>Generate Today's Insight</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Insight Card */}
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Text style={styles.insightIcon}>💡</Text>
                <Text style={styles.insightDate}>
                  {format(new Date(todayInsight.date), 'MMMM d, yyyy')}
                </Text>
              </View>
              <Text style={styles.insightText}>{todayInsight.insight}</Text>
            </View>

            {/* Pattern Card (if available) */}
            {todayInsight.pattern && (
              <View style={styles.patternCard}>
                <Text style={styles.patternTitle}>📊 Identified Pattern</Text>
                <Text style={styles.patternText}>{todayInsight.pattern}</Text>
              </View>
            )}

            {/* Strategies Section */}
            {todayInsight.strategies && todayInsight.strategies.length > 0 && (
              <View style={styles.strategiesSection}>
                <Text style={styles.sectionTitle}>💪 Suggested Strategies</Text>
                <Text style={styles.sectionSubtitle}>
                  Try these coping strategies based on your current state
                </Text>

                {todayInsight.strategies.map((strategy, index) => (
                  <View key={index} style={styles.strategyCard}>
                    <Text style={styles.strategyIcon}>{renderStrategyIcon(index)}</Text>
                    <Text style={styles.strategyText}>{strategy}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Info Footer */}
            <View style={styles.infoFooter}>
              <Text style={styles.infoText}>
                💚 New insights are generated daily based on your emotional patterns and activities
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  generateButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B9F7D',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666666',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 14,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#6B9F7D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  generateLargeButton: {
    backgroundColor: '#6B9F7D',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  generateLargeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  insightIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  insightDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  insightText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
  },
  patternCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  patternTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  patternText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#2E7D32',
  },
  strategiesSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 16,
  },
  strategyCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  strategyIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  strategyText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#333333',
  },
  infoFooter: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#7D6608',
    textAlign: 'center',
  },
});
