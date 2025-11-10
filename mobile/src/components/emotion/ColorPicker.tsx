/**
 * Color Picker Component
 * 감정 색상 선택 컴포넌트
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { EMOTION_COLORS } from '../../types/emotion';

interface ColorPickerProps {
  selectedColor?: string;
  onSelect: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>감정의 색깔을 선택하세요</Text>
      <View style={styles.colorsGrid}>
        {EMOTION_COLORS.map(option => {
          const isSelected = selectedColor === option.color;
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.colorButton,
                { backgroundColor: option.color },
                isSelected && styles.colorButtonSelected,
              ]}
              onPress={() => onSelect(option.color)}
              activeOpacity={0.7}>
              {isSelected && (
                <View style={styles.checkCircle}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      {selectedColor && (
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedEmoji}>
            {EMOTION_COLORS.find(c => c.color === selectedColor)?.emoji}
          </Text>
          <View>
            <Text style={styles.selectedName}>
              {EMOTION_COLORS.find(c => c.color === selectedColor)?.name}
            </Text>
            <Text style={styles.selectedDescription}>
              {EMOTION_COLORS.find(c => c.color === selectedColor)?.description}
            </Text>
          </View>
        </View>
      )}
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
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorButtonSelected: {
    borderColor: '#2D5F4C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#2D5F4C',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F4EF',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    gap: 12,
  },
  selectedEmoji: {
    fontSize: 32,
  },
  selectedName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D5F4C',
  },
  selectedDescription: {
    fontSize: 14,
    color: '#6B9080',
  },
});

export default ColorPicker;
