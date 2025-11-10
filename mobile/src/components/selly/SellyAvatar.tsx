/**
 * Selly Avatar Component
 * 셀리 캐릭터 아바타 표시
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SellyStage, SellyStyle } from '../../types/selly';

interface SellyAvatarProps {
  stage: SellyStage;
  style?: SellyStyle;
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
  progress?: number; // 0-100
}

const STAGE_EMOJIS = {
  [SellyStage.SEED]: '🌰',
  [SellyStage.SPROUT]: '🌱',
  [SellyStage.FLOWER]: '🌸',
  [SellyStage.BABY]: '💚',
};

const SIZE_CONFIG = {
  small: { container: 60, emoji: 32, progress: 4 },
  medium: { container: 100, emoji: 56, progress: 6 },
  large: { container: 140, emoji: 80, progress: 8 },
};

const STYLE_COLORS = {
  [SellyStyle.GREEN]: '#2D5F4C',
  [SellyStyle.PINK]: '#D5006D',
  [SellyStyle.BLUE]: '#1E88E5',
  [SellyStyle.GOLDEN]: '#FFD700',
};

const SellyAvatar: React.FC<SellyAvatarProps> = ({
  stage,
  style = SellyStyle.GREEN,
  size = 'medium',
  showProgress = false,
  progress = 0,
}) => {
  const sizeConfig = SIZE_CONFIG[size];
  const styleColor = STYLE_COLORS[style];

  return (
    <View style={styles.container}>
      {/* 아바타 원 */}
      <View
        style={[
          styles.avatarCircle,
          {
            width: sizeConfig.container,
            height: sizeConfig.container,
            borderRadius: sizeConfig.container / 2,
            borderColor: styleColor,
          },
        ]}>
        <Text style={[styles.emoji, { fontSize: sizeConfig.emoji }]}>
          {STAGE_EMOJIS[stage]}
        </Text>

        {/* 스타일 색상 점 */}
        <View
          style={[
            styles.styleDot,
            {
              backgroundColor: styleColor,
              width: sizeConfig.container / 5,
              height: sizeConfig.container / 5,
              borderRadius: sizeConfig.container / 10,
            },
          ]}
        />
      </View>

      {/* 진행도 바 (선택사항) */}
      {showProgress && (
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { height: sizeConfig.progress },
            ]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: styleColor,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatarCircle: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  emoji: {
    textAlign: 'center',
  },
  styleDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  progressContainer: {
    width: '100%',
    marginTop: 12,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6B9080',
    marginTop: 4,
    fontWeight: '600',
  },
});

export default SellyAvatar;
