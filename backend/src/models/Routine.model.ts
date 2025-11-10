/**
 * Routine Model
 * 루틴 완료 기록 저장
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IRoutine extends Document {
  userId: mongoose.Types.ObjectId;
  routineId: string;
  type: 'meditation' | 'breathing' | 'activity';
  startedAt: Date;
  completedAt: Date;
  duration: number; // seconds
  rating: number; // 1-5
  createdAt: Date;
  updatedAt: Date;
}

const routineSchema = new Schema<IRoutine>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    routineId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['meditation', 'breathing', 'activity'],
    },
    startedAt: {
      type: Date,
      required: true,
    },
    completedAt: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 0,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user and date queries
routineSchema.index({ userId: 1, completedAt: -1 });
routineSchema.index({ userId: 1, type: 1 });

export const Routine = mongoose.model<IRoutine>('Routine', routineSchema);
