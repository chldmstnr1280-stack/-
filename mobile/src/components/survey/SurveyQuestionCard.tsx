/**
 * Survey Question Component
 * 설문 질문 카드
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SurveyQuestion } from '../../types/survey';

interface SurveyQuestionCardProps {
  question: SurveyQuestion;
  selectedValue?: number;
  onSelect: (value: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

const SurveyQuestionCard: React.FC<SurveyQuestionCardProps> = ({
  question,
  selectedValue,
  onSelect,
  questionNumber,
  totalQuestions,
}) => {
  return (
    <View style={styles.container}>
      {/* 진행도 */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {questionNumber} / {totalQuestions}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(questionNumber / totalQuestions) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* 질문 */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionNumber}>Q{questionNumber}</Text>
        <Text style={styles.questionText}>{question.text}</Text>
      </View>

      {/* 선택지 */}
      <View style={styles.optionsContainer}>
        {question.options.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              selectedValue === option.value && styles.optionButtonSelected,
            ]}
            onPress={() => onSelect(option.value)}
            activeOpacity={0.7}>
            <View
              style={[
                styles.optionRadio,
                selectedValue === option.value && styles.optionRadioSelected,
              ]}>
              {selectedValue === option.value && <View style={styles.optionRadioDot} />}
            </View>
            <Text
              style={[
                styles.optionText,
                selectedValue === option.value && styles.optionTextSelected,
              ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B9080',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2D5F4C',
    borderRadius: 2,
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5F4C',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#2D5F4C',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F9F7',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    backgroundColor: '#E8F4EF',
    borderColor: '#2D5F4C',
  },
  optionRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#A0B5AC',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionRadioSelected: {
    borderColor: '#2D5F4C',
  },
  optionRadioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2D5F4C',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#2D5F4C',
  },
  optionTextSelected: {
    fontWeight: '600',
  },
});

export default SurveyQuestionCard;
