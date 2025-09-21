import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TopicDocument = Topic & Document;

@Schema({ timestamps: true })
export class Topic {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);

export type ProblemDocument = Problem & Document;

export enum DifficultyLevel {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

@Schema({ timestamps: true })
export class Problem {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Topic', required: true })
  topicId: Types.ObjectId;

  @Prop({ type: String, enum: DifficultyLevel, required: true })
  difficulty: DifficultyLevel;

  @Prop()
  youtubeLink: string;

  @Prop()
  leetcodeLink: string;

  @Prop()
  codeforcesLink: string;

  @Prop()
  articleLink: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const ProblemSchema = SchemaFactory.createForClass(Problem);

export type UserProgressDocument = UserProgress & Document;

@Schema({ timestamps: true })
export class UserProgress {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Problem', required: true })
  problemId: Types.ObjectId;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop()
  completedAt: Date;

  @Prop()
  notes: string;
}

export const UserProgressSchema = SchemaFactory.createForClass(UserProgress);

// Create unique compound index for user-problem combination
UserProgressSchema.index({ userId: 1, problemId: 1 }, { unique: true });