/**
 * Breathing Timer Component
 * 호흡법 타이머 (시각적 가이드 포함)
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { BreathingPattern } from '../../types/routine';

interface BreathingTimerProps {
  pattern: BreathingPattern;
  onComplete: () => void;
  onCancel: () => void;
}

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'holdAfter';

const BreathingTimer: React.FC<BreathingTimerProps> = ({ pattern, onComplete, onCancel }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('inhale');
  const [timeLeft, setTimeLeft] = useState(pattern.pattern.inhale);

  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getPhaseText = (phase: BreathingPhase): string => {
    switch (phase) {
      case 'inhale':
        return '들숨';
      case 'hold':
        return '숨 참기';
      case 'exhale':
        return '날숨';
      case 'holdAfter':
        return '숨 참기';
      default:
        return '';
    }
  };

  const getNextPhase = (phase: BreathingPhase): BreathingPhase | null => {
    switch (phase) {
      case 'inhale':
        return pattern.pattern.hold ? 'hold' : 'exhale';
      case 'hold':
        return 'exhale';
      case 'exhale':
        return pattern.pattern.holdAfter ? 'holdAfter' : null;
      case 'holdAfter':
        return null;
      default:
        return null;
    }
  };

  const getPhaseDuration = (phase: BreathingPhase): number => {
    switch (phase) {
      case 'inhale':
        return pattern.pattern.inhale;
      case 'hold':
        return pattern.pattern.hold || 0;
      case 'exhale':
        return pattern.pattern.exhale;
      case 'holdAfter':
        return pattern.pattern.holdAfter || 0;
      default:
        return 0;
    }
  };

  const animateCircle = (phase: BreathingPhase) => {
    const targetScale = phase === 'inhale' ? 1 : 0.5;
    const duration = getPhaseDuration(phase) * 1000;

    Animated.timing(scaleAnim, {
      toValue: targetScale,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const startTimer = () => {
    setIsRunning(true);
    setCurrentCycle(1);
    setCurrentPhase('inhale');
    setTimeLeft(pattern.pattern.inhale);
    animateCircle('inhale');
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          const nextPhase = getNextPhase(currentPhase);

          if (nextPhase) {
            // 다음 단계로
            setCurrentPhase(nextPhase);
            const nextDuration = getPhaseDuration(nextPhase);
            animateCircle(nextPhase);
            return nextDuration;
          } else {
            // 사이클 완료
            if (currentCycle < pattern.cycles) {
              setCurrentCycle(currentCycle + 1);
              setCurrentPhase('inhale');
              animateCircle('inhale');
              return pattern.pattern.inhale;
            } else {
              // 모든 사이클 완료
              stopTimer();
              onComplete();
              return 0;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, currentPhase, currentCycle]);

  const handleCancel = () => {
    stopTimer();
    onCancel();
  };

  return (
    <View style={styles.container}>
      {/* 진행도 */}
      <View style={styles.progressContainer}>
        <Text style={styles.cycleText}>
          {currentCycle} / {pattern.cycles} 사이클
        </Text>
      </View>

      {/* 호흡 원 */}
      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            styles.breathingCircle,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}>
          {isRunning && (
            <>
              <Text style={styles.phaseText}>{getPhaseText(currentPhase)}</Text>
              <Text style={styles.timerText}>{timeLeft}</Text>
            </>
          )}
          {!isRunning && <Text style={styles.startText}>시작</Text>}
        </Animated.View>
      </View>

      {/* 안내 */}
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          {isRunning
            ? '원의 크기에 맞춰 호흡하세요'
            : '시작 버튼을 눌러 호흡을 시작하세요'}
        </Text>
      </View>

      {/* 버튼 */}
      <View style={styles.buttonsContainer}>
        {!isRunning ? (
          <TouchableOpacity style={styles.startButton} onPress={startTimer} activeOpacity={0.8}>
            <Text style={styles.startButtonText}>시작하기</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} activeOpacity={0.8}>
            <Text style={styles.cancelButtonText}>중단</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 40,
  },
  progressContainer: {
    alignItems: 'center',
  },
  cycleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D5F4C',
  },
  circleContainer: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#2D5F4C',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  phaseText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  startText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  instructionContainer: {
    paddingHorizontal: 32,
  },
  instructionText: {
    fontSize: 16,
    color: '#6B9080',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonsContainer: {
    width: '100%',
    paddingHorizontal: 32,
  },
  startButton: {
    backgroundColor: '#2D5F4C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default BreathingTimer;
