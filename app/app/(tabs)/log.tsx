import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useEmotionStore } from '../../src/stores/emotionStore';

const EMOTIONS = [
  { label: 'happy', emoji: '😊', color: '#FFD700' },
  { label: 'sad', emoji: '😢', color: '#4169E1' },
  { label: 'anxious', emoji: '😰', color: '#FF6B6B' },
  { label: 'calm', emoji: '😌', color: '#87CEEB' },
  { label: 'excited', emoji: '🤩', color: '#FF69B4' },
  { label: 'grateful', emoji: '🙏', color: '#98FB98' },
  { label: 'stressed', emoji: '😫', color: '#FFA500' },
  { label: 'angry', emoji: '😠', color: '#DC143C' },
];

export default function LogScreen() {
  const router = useRouter();
  const createEntry = useEmotionStore((state) => state.createEntry);

  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedEmotion) {
      Alert.alert('Error', 'Please select an emotion');
      return;
    }

    setIsLoading(true);
    try {
      await createEntry({
        emotionLabel: selectedEmotion,
        intensity,
        notes: notes.trim() || undefined,
        tags: [],
      });

      Alert.alert('Success', 'Emotion logged successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setSelectedEmotion('');
            setIntensity(5);
            setNotes('');
            // Go back to home
            router.push('/(tabs)/home');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to log emotion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>How are you feeling?</Text>
        <View style={styles.emotionsGrid}>
          {EMOTIONS.map((emotion) => (
            <TouchableOpacity
              key={emotion.label}
              style={[
                styles.emotionButton,
                selectedEmotion === emotion.label && {
                  backgroundColor: emotion.color,
                  borderWidth: 3,
                  borderColor: '#2E7D32',
                },
              ]}
              onPress={() => setSelectedEmotion(emotion.label)}
            >
              <Text style={styles.emotionEmoji}>{emotion.emoji}</Text>
              <Text style={styles.emotionLabel}>{emotion.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Intensity (0-10)</Text>
        <View style={styles.intensityContainer}>
          <Text style={styles.intensityValue}>{intensity}</Text>
          <View style={styles.intensityButtons}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.intensityButton,
                  intensity === value && styles.intensityButtonActive,
                ]}
                onPress={() => setIntensity(value)}
              >
                <Text
                  style={[
                    styles.intensityButtonText,
                    intensity === value && styles.intensityButtonTextActive,
                  ]}
                >
                  {value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Notes (optional)</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="What's on your mind?"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Logging...' : 'Log Emotion'}
          </Text>
        </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 15,
    marginTop: 10,
  },
  emotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  emotionButton: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#C8E6C9',
  },
  emotionEmoji: {
    fontSize: 32,
    marginBottom: 5,
  },
  emotionLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  intensityContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  intensityValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 15,
  },
  intensityButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  intensityButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  intensityButtonActive: {
    backgroundColor: '#4CAF50',
  },
  intensityButtonText: {
    fontSize: 16,
    color: '#666',
  },
  intensityButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  notesInput: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
