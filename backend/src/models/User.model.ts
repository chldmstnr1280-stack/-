/**
 * User Model
 * 사용자 정보 저장
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  age: number;
  isHSP: boolean;
  hspAnswers: number[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 150,
    },
    isHSP: {
      type: Boolean,
      required: true,
      default: false,
    },
    hspAnswers: {
      type: [Number],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
userSchema.index({ email: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
