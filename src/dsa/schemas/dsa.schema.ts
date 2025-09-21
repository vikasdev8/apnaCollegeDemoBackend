import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Chapter Schema - Grouping for topics (like Arrays, Strings, etc.)
export type ChapterDocument = Chapter & Document;

@Schema({ timestamps: true })
export class Chapter {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  icon: string; // For UI representation
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);

// Topic Schema - Sub-categories under chapters
export type TopicDocument = Topic & Document;

@Schema({ timestamps: true })
export class Topic {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Chapter', required: true })
  chapterId: Types.ObjectId;

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

  @Prop()
  geeksforgeeksLink: string; // Additional resource

  @Prop()
  interviewbitLink: string; // Additional resource

  @Prop([String])
  tags: string[]; // For categorizing problems (like "two-pointer", "sliding-window")

  @Prop()
  timeComplexity: string; // Expected time complexity

  @Prop()
  spaceComplexity: string; // Expected space complexity

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isPremium: boolean; // For marking premium problems
}

export const ProblemSchema = SchemaFactory.createForClass(Problem);

export type UserProgressDocument = UserProgress & Document;

export enum SolutionStatus {
  NOT_STARTED = 'not-started',
  IN_PROGRESS = 'in-progress',
  SOLVED_WITH_HELP = 'solved-with-help',
  SOLVED_INDEPENDENTLY = 'solved-independently',
  NEEDS_REVIEW = 'needs-review'
}

@Schema({ timestamps: true })
export class UserProgress {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Problem', required: true })
  problemId: Types.ObjectId;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ type: String, enum: SolutionStatus, default: SolutionStatus.NOT_STARTED })
  status: SolutionStatus;

  @Prop()
  completedAt: Date;

  @Prop()
  notes: string;

  @Prop()
  solutionCode: string; // User's solution code

  @Prop()
  timeSpent: number; // Time spent in minutes

  @Prop({ default: 0 })
  attempts: number; // Number of attempts made

  @Prop()
  lastAttemptedAt: Date;

  @Prop({ default: false })
  isBookmarked: boolean; // For favorites

  @Prop({ min: 1, max: 5 })
  difficultyRating: number; // User's personal difficulty rating
}

export const UserProgressSchema = SchemaFactory.createForClass(UserProgress);

// Create unique compound index for user-problem combination
UserProgressSchema.index({ userId: 1, problemId: 1 }, { unique: true });