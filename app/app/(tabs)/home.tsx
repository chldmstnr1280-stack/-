import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../src/api/client';
import { MascotState } from '../../src/types';

const MASCOT_VISUALS = {
  seed: { emoji: '🌰', name: '씨앗 셀리' },
  sprout: { emoji: '🌱', name: '새싹 셀리' },
  kid: { emoji: '🌿', name: '꼬마 셀리' },
};

export default function HomeScreen() {
  const router = useRouter();
  const [mascot, setMascot] = useState<MascotState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadMascot = async () => {
    try {
      const data = await api.getMascotToday();
      setMascot(data);
    } catch (error) {
      console.error('Failed to load mascot:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMascot();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const visual = mascot ? MASCOT_VISUALS[mascot.stage] : MASCOT_VISUALS.seed;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Your Garden</Text>

        {/* Mascot Display */}
        <View style={styles.mascotContainer}>
          <Text style={styles.mascotEmoji}>{visual.emoji}</Text>
          <Text style={styles.mascotName}>{visual.name}</Text>
          <Text style={styles.mascotScore}>Growth Score: {mascot?.score || 0}</Text>
        </View>

        {/* Support Message */}
        <View style={styles.messageCard}>
          <Text style={styles.message}>{mascot?.message || 'Welcome to SELLERY!'}</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/log')}
          >
            <Text style={styles.actionEmoji}>📝</Text>
            <Text style={styles.actionText}>Log Emotion</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/report')}
          >
            <Text style={styles.actionEmoji}>📊</Text>
            <Text style={styles.actionText}>View Report</Text>
          </TouchableOpacity>
        </View>

        {/* Growth Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How to grow Selly:</Text>
          <Text style={styles.infoText}>• Log your emotions daily</Text>
          <Text style={styles.infoText}>• Be aware of your feelings</Text>
          <Text style={styles.infoText}>• Watch Selly evolve with you!</Text>
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
    textAlign: 'center',
  },
  mascotContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mascotEmoji: {
    fontSize: 120,
    marginBottom: 15,
  },
  mascotName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 5,
  },
  mascotScore: {
    fontSize: 16,
    color: '#666',
  },
  messageCard: {
    backgroundColor: '#C8E6C9',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: '#1B5E20',
    lineHeight: 24,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  actionButton: {
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
  actionEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});
