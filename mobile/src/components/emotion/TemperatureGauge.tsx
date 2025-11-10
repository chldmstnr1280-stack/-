/**
 * Temperature Gauge Component
 * 감정 온도계 슬라이더
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TemperatureGaugeProps {
  temperature: number; // 0-100
  onChange: (temp: number) => void;
}

const TemperatureGauge: React.FC<TemperatureGaugeProps> = ({ temperature, onChange }) => {
  const getTemperatureColor = (temp: number): string => {
    if (temp < 30) return '#87CEEB'; // 낮음 - 파랑
    if (temp < 60) return '#98D8C8'; // 중간 - 청록
    if (temp < 80) return '#FFD700'; // 높음 - 노랑
    return '#FF6347'; // 매우 높음 - 빨강
  };

  const getTemperatureLabel = (temp: number): string => {
    if (temp < 30) return '차갑고 우울해요';
    if (temp < 60) return '평온하고 안정적이에요';
    if (temp < 80) return '따뜻하고 활기차요';
    return '뜨겁고 격렬해요';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>감정 온도 (선택사항)</Text>

      <View style={styles.gaugeContainer}>
        {/* 온도계 표시 */}
        <View style={styles.thermometer}>
          <View
            style={[
              styles.thermometerFill,
              {
                height: `${temperature}%`,
                backgroundColor: getTemperatureColor(temperature),
              },
            ]}
          />
        </View>

        {/* 온도 값 */}
        <View style={styles.temperatureDisplay}>
          <Text style={[styles.temperatureValue, { color: getTemperatureColor(temperature) }]}>
            {temperature}°C
          </Text>
          <Text style={styles.temperatureLabel}>{getTemperatureLabel(temperature)}</Text>
        </View>
      </View>

      {/* 간단한 버튼으로 조절 (실제로는 Slider 사용 가능) */}
      <View style={styles.controls}>
        <Text style={styles.controlButton} onPress={() => onChange(Math.max(0, temperature - 10))}>
          ➖
        </Text>
        <Text style={styles.controlButton} onPress={() => onChange(Math.min(100, temperature + 10))}>
          ➕
        </Text>
      </View>

      <Text style={styles.hint}>💡 자동으로 계산되지만, 직접 조절할 수도 있어요</Text>
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
  gaugeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 20,
  },
  thermometer: {
    width: 40,
    height: 200,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  thermometerFill: {
    width: '100%',
    borderRadius: 20,
  },
  temperatureDisplay: {
    flex: 1,
  },
  temperatureValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  temperatureLabel: {
    fontSize: 16,
    color: '#6B9080',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginTop: 16,
  },
  controlButton: {
    fontSize: 32,
    padding: 8,
  },
  hint: {
    fontSize: 13,
    color: '#A0B5AC',
    textAlign: 'center',
    marginTop: 12,
  },
});

export default TemperatureGauge;
