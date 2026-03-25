import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  walletAddress?: string;
  githubUsername?: string;
  linkedinProfile?: string;
  upworkProfile?: string;
  stackoverflowProfile?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
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
      private: true, // Used by some plugins to hide by default
    },
    walletAddress: {
      type: String,
      default: '',
    },
    githubUsername: {
      type: String,
      default: '',
    },
    linkedinProfile: {
      type: String,
      default: '',
    },
    upworkProfile: {
      type: String,
      default: '',
    },
    stackoverflowProfile: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', userSchema);
