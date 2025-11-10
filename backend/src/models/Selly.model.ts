/**
 * Selly Model
 * 셀리 성장 상태 저장
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface ISelly extends Document {
  userId: mongoose.Types.ObjectId;
  stage: 'seed' | 'sprout' | 'flower' | 'baby';
  style: 'green' | 'pink' | 'blue';
  experience: number;
  createdAt: Date;
  updatedAt: Date;
}

const sellySchema = new Schema<ISelly>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    stage: {
      type: String,
      required: true,
      enum: ['seed', 'sprout', 'flower', 'baby'],
      default: 'seed',
    },
    style: {
      type: String,
      required: true,
      enum: ['green', 'pink', 'blue'],
      default: 'green',
    },
    experience: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Selly = mongoose.model<ISelly>('Selly', sellySchema);
