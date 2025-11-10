/**
 * Emoji Picker Component
 * 감정 이모지 선택 컴포넌트
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface EmojiOption {
  emoji: string;
  label: string;
}

const EMOTION_EMOJIS: EmojiOption[] = [
  { emoji: '😊', label: '행복' },
  { emoji: '😌', label: '평온' },
  { emoji: '😢', label: '슬픔' },
  { emoji: '😰', label: '불안' },
  { emoji: '😠', label: '분노' },
  { emoji: '😴', label: '피곤' },
  { emoji: '🤗', label: '설렘' },
  { emoji: '😔', label: '우울' },
  { emoji: '😤', label: '답답' },
  { emoji: '😳', label: '당황' },
  { emoji: '🥰', label: '사랑' },
  { emoji: '😎', label: '자신감' },
  { emoji: '🤔', label: '고민' },
  { emoji: '😐', label: '무덤덤' },
  { emoji: '🥺', label: '서운' },
];

interface EmojiPickerProps {
  selectedEmoji?: string;
  onSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ selectedEmoji, onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>오늘의 기분을 선택하세요</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {EMOTION_EMOJIS.map(option => (
          <TouchableOpacity
            key={option.emoji}
            style={[styles.emojiButton, selectedEmoji === option.emoji && styles.emojiButtonSelected]}
            onPress={() => onSelect(option.emoji)}
            activeOpacity={0.7}>
            <Text style={styles.emoji}>{option.emoji}</Text>
            <Text
              style={[
                styles.emojiLabel,
                selectedEmoji === option.emoji && styles.emojiLabelSelected,
              ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D5F4C',
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  emojiButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4E4DC',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 70,
  },
  emojiButtonSelected: {
    backgroundColor: '#E8F4EF',
    borderColor: '#2D5F4C',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  emojiLabel: {
    fontSize: 12,
    color: '#6B9080',
  },
  emojiLabelSelected: {
    color: '#2D5F4C',
    fontWeight: '600',
  },
});

export default EmojiPicker;
