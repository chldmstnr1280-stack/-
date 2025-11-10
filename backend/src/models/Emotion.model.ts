/**
 * Emotion Model
 * 감정 로그 저장
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IEmotion extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  text: string;
  emoji: string;
  color: string;
  temperature: number;
  activities?: {
    steps?: number;
    distance?: number;
    activeMinutes?: number;
    sleepHours?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const emotionSchema = new Schema<IEmotion>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    text: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },
    emoji: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
      match: /^#[0-9A-F]{6}$/i,
    },
    temperature: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    activities: {
      steps: { type: Number, min: 0 },
      distance: { type: Number, min: 0 },
      activeMinutes: { type: Number, min: 0 },
      sleepHours: { type: Number, min: 0, max: 24 },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user and date queries
emotionSchema.index({ userId: 1, date: -1 });

export const Emotion = mongoose.model<IEmotion>('Emotion', emotionSchema);
