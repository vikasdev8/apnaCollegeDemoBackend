import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { 
  Chapter, 
  ChapterDocument, 
  Topic, 
  TopicDocument, 
  Problem, 
  ProblemDocument, 
  UserProgress, 
  UserProgressDocument,
  SolutionStatus 
} from './schemas/dsa.schema';

export interface CreateChapterDto {
  name: string;
  description: string;
  order?: number;
  icon?: string;
}

export interface CreateTopicDto {
  name: string;
  description: string;
  chapterId: string;
  order?: number;
}

export interface CreateProblemDto {
  title: string;
  description: string;
  topicId: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  youtubeLink?: string;
  leetcodeLink?: string;
  codeforcesLink?: string;
  articleLink?: string;
  geeksforgeeksLink?: string;
  interviewbitLink?: string;
  tags?: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
  order?: number;
  isPremium?: boolean;
}

export interface UpdateProgressDto {
  isCompleted?: boolean;
  status?: SolutionStatus;
  notes?: string;
  solutionCode?: string;
  timeSpent?: number;
  isBookmarked?: boolean;
  difficultyRating?: number;
}

@Injectable()
export class DsaService {
  constructor(
    @InjectModel(Chapter.name) private chapterModel: Model<ChapterDocument>,
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
    @InjectModel(Problem.name) private problemModel: Model<ProblemDocument>,
    @InjectModel(UserProgress.name) private userProgressModel: Model<UserProgressDocument>,
  ) {}

  // Chapter methods
  async createChapter(createChapterDto: CreateChapterDto): Promise<ChapterDocument> {
    const chapter = new this.chapterModel(createChapterDto);
    return chapter.save();
  }

  async findAllChapters(): Promise<ChapterDocument[]> {
    return this.chapterModel.find({ isActive: true }).sort({ order: 1 }).exec();
  }

  async findChapterById(id: string): Promise<ChapterDocument> {
    const chapter = await this.chapterModel.findById(id).exec();
    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }
    return chapter;
  }

  // Topic methods
  async createTopic(createTopicDto: CreateTopicDto): Promise<TopicDocument> {
    // Verify chapter exists
    await this.findChapterById(createTopicDto.chapterId);
    
    const topic = new this.topicModel({
      ...createTopicDto,
      chapterId: new Types.ObjectId(createTopicDto.chapterId),
    });
    return topic.save();
  }

  async findAllTopics(): Promise<TopicDocument[]> {
    return this.topicModel
      .find({ isActive: true })
      .populate('chapterId', 'name')
      .sort({ order: 1 })
      .exec();
  }

  async findTopicsByChapter(chapterId: string): Promise<TopicDocument[]> {
    return this.topicModel
      .find({ chapterId: new Types.ObjectId(chapterId), isActive: true })
      .sort({ order: 1 })
      .exec();
  }

  async findTopicById(id: string): Promise<TopicDocument> {
    const topic = await this.topicModel
      .findById(id)
      .populate('chapterId', 'name')
      .exec();
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }
    return topic;
  }

  // Problem methods
  async createProblem(createProblemDto: CreateProblemDto): Promise<ProblemDocument> {
    // Verify topic exists
    await this.findTopicById(createProblemDto.topicId);
    
    const problem = new this.problemModel({
      ...createProblemDto,
      topicId: new Types.ObjectId(createProblemDto.topicId),
    });
    return problem.save();
  }

  async findProblemsByTopic(topicId: string): Promise<ProblemDocument[]> {
    return this.problemModel
      .find({ topicId: new Types.ObjectId(topicId), isActive: true })
      .sort({ order: 1 })
      .exec();
  }

  async findAllProblems(): Promise<ProblemDocument[]> {
    return this.problemModel
      .find({ isActive: true })
      .populate('topicId', 'name')
      .sort({ order: 1 })
      .exec();
  }

  async findProblemById(id: string): Promise<ProblemDocument> {
    const problem = await this.problemModel.findById(id).populate('topicId', 'name').exec();
    if (!problem) {
      throw new NotFoundException('Problem not found');
    }
    return problem;
  }

  // Progress methods
  async updateUserProgress(userId: string, problemId: string, updateProgressDto: UpdateProgressDto): Promise<UserProgressDocument> {
    // Verify problem exists
    await this.findProblemById(problemId);

    const filter = {
      userId: new Types.ObjectId(userId),
      problemId: new Types.ObjectId(problemId),
    };

    const updateData: any = { ...updateProgressDto };
    
    // Auto-set completion status based on status
    if (updateProgressDto.status && 
        [SolutionStatus.SOLVED_WITH_HELP, SolutionStatus.SOLVED_INDEPENDENTLY].includes(updateProgressDto.status)) {
      updateData.isCompleted = true;
      updateData.completedAt = new Date();
    } else if (updateProgressDto.isCompleted === false) {
      updateData.completedAt = null;
    }

    // Update last attempted date
    updateData.lastAttemptedAt = new Date();
    
    // Increment attempts if status is changing to a new attempt
    if (updateProgressDto.status && updateProgressDto.status !== SolutionStatus.NOT_STARTED) {
      const existingProgress = await this.userProgressModel.findOne(filter);
      if (!existingProgress || existingProgress.status === SolutionStatus.NOT_STARTED) {
        updateData.$inc = { attempts: 1 };
      }
    }

    const progress = await this.userProgressModel
      .findOneAndUpdate(
        filter,
        updateData,
        { upsert: true, new: true }
      )
      .exec();

    return progress;
  }

  async getUserProgress(userId: string): Promise<UserProgressDocument[]> {
    return this.userProgressModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('problemId', 'title difficulty topicId')
      .exec();
  }

  async getUserProgressForTopic(userId: string, topicId: string): Promise<UserProgressDocument[]> {
    // First get all problems for this topic
    const problems = await this.findProblemsByTopic(topicId);
    const problemIds = problems.map(p => p._id);

    return this.userProgressModel
      .find({
        userId: new Types.ObjectId(userId),
        problemId: { $in: problemIds }
      })
      .populate('problemId', 'title difficulty')
      .exec();
  }

  async getDsaSheetWithProgress(userId: string): Promise<any> {
    const chapters = await this.findAllChapters();
    const userProgress = await this.getUserProgress(userId);
    
    // Create a map of problem progress for quick lookup
    const progressMap = new Map();
    userProgress.forEach(progress => {
      progressMap.set(progress.problemId._id.toString(), progress);
    });

    const dsaSheet = await Promise.all(
      chapters.map(async (chapter) => {
        const topics = await this.findTopicsByChapter(chapter._id.toString());
        
        const topicsWithProblems = await Promise.all(
          topics.map(async (topic) => {
            const problems = await this.findProblemsByTopic(topic._id.toString());
            
            const problemsWithProgress = problems.map(problem => ({
              ...problem.toObject(),
              progress: progressMap.get(problem._id.toString()) || { 
                isCompleted: false, 
                status: SolutionStatus.NOT_STARTED,
                attempts: 0,
                isBookmarked: false
              }
            }));

            const completedCount = problemsWithProgress.filter(p => p.progress.isCompleted).length;
            
            return {
              ...topic.toObject(),
              problems: problemsWithProgress,
              totalProblems: problems.length,
              completedProblems: completedCount,
              completionPercentage: problems.length > 0 ? Math.round((completedCount / problems.length) * 100) : 0
            };
          })
        );

        const chapterTotalProblems = topicsWithProblems.reduce((sum, topic) => sum + topic.totalProblems, 0);
        const chapterCompletedProblems = topicsWithProblems.reduce((sum, topic) => sum + topic.completedProblems, 0);
        
        return {
          ...chapter.toObject(),
          topics: topicsWithProblems,
          totalProblems: chapterTotalProblems,
          completedProblems: chapterCompletedProblems,
          completionPercentage: chapterTotalProblems > 0 ? Math.round((chapterCompletedProblems / chapterTotalProblems) * 100) : 0
        };
      })
    );

    return dsaSheet;
  }

  async getUserStats(userId: string): Promise<any> {
    const totalProblems = await this.problemModel.countDocuments({ isActive: true });
    const userProgress = await this.getUserProgress(userId);
    const completedProblems = userProgress.filter(p => p.isCompleted).length;

    // Count by difficulty
    const completedByDifficulty = await this.userProgressModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          isCompleted: true
        }
      },
      {
        $lookup: {
          from: 'problems',
          localField: 'problemId',
          foreignField: '_id',
          as: 'problem'
        }
      },
      {
        $unwind: '$problem'
      },
      {
        $group: {
          _id: '$problem.difficulty',
          count: { $sum: 1 }
        }
      }
    ]);

    const difficultyStats = {
      Easy: 0,
      Medium: 0,
      Hard: 0
    };

    completedByDifficulty.forEach(stat => {
      difficultyStats[stat._id] = stat.count;
    });

    return {
      totalProblems,
      completedProblems,
      remainingProblems: totalProblems - completedProblems,
      completionPercentage: totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0,
      difficultyStats
    };
  }

  // Additional utility methods
  async getBookmarkedProblems(userId: string): Promise<UserProgressDocument[]> {
    return this.userProgressModel
      .find({ 
        userId: new Types.ObjectId(userId),
        isBookmarked: true 
      })
      .populate('problemId', 'title difficulty topicId')
      .exec();
  }

  async bulkUpdateProgress(userId: string, updates: { problemId: string; updateData: UpdateProgressDto }[]): Promise<any> {
    const bulkOps = updates.map(({ problemId, updateData }) => ({
      updateOne: {
        filter: {
          userId: new Types.ObjectId(userId),
          problemId: new Types.ObjectId(problemId),
        },
        update: {
          ...updateData,
          lastAttemptedAt: new Date(),
        },
        upsert: true
      }
    }));

    const result = await this.userProgressModel.bulkWrite(bulkOps);
    return result;
  }

  async searchProblems(query: string, difficulty?: string, tags?: string[]): Promise<ProblemDocument[]> {
    const filter: any = { isActive: true };
    
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ];
    }
    
    if (difficulty) {
      filter.difficulty = difficulty;
    }
    
    if (tags && tags.length > 0) {
      filter.tags = { $in: tags };
    }

    return this.problemModel
      .find(filter)
      .populate('topicId', 'name chapterId')
      .sort({ order: 1 })
      .exec();
  }
}