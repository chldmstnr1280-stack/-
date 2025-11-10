/**
 * Survey Model
 * PHQ-9, GAD-7 설문 결과 저장
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface ISurveyResponse {
  questionId: string;
  value: number;
}

export interface ISurvey extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'phq9' | 'gad7';
  responses: ISurveyResponse[];
  totalScore: number;
  severity: 'minimal' | 'mild' | 'moderate' | 'severe';
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const surveySchema = new Schema<ISurvey>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['phq9', 'gad7'],
    },
    responses: [
      {
        questionId: { type: String, required: true },
        value: { type: Number, required: true, min: 0, max: 3 },
      },
    ],
    totalScore: {
      type: Number,
      required: true,
      min: 0,
    },
    severity: {
      type: String,
      required: true,
      enum: ['minimal', 'mild', 'moderate', 'severe'],
    },
    completedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user, type, and date queries
surveySchema.index({ userId: 1, type: 1, completedAt: -1 });

export const Survey = mongoose.model<ISurvey>('Survey', surveySchema);
