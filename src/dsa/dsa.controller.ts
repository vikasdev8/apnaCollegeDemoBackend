import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Patch, 
  UseGuards, 
  Req,
  Query,
  BadRequestException,
  UnauthorizedException
} from '@nestjs/common';
import { 
  DsaService, 
  CreateChapterDto,
  CreateTopicDto, 
  CreateProblemDto, 
  UpdateProgressDto 
} from './dsa.service';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../schemas/user.schema';
import { Request } from 'express';

declare module 'express-session' {
  interface SessionData {
    userId: string;
    role: string;
  }
}

@Controller('dsa')
@UseGuards(AuthenticatedGuard)
export class DsaController {
  constructor(private readonly dsaService: DsaService) {}

  // Chapter endpoints - Admin only for creation
  @Post('chapters')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async createChapter(@Body() createChapterDto: CreateChapterDto) {
    return this.dsaService.createChapter(createChapterDto);
  }

  @Get('chapters')
  async getAllChapters() {
    return this.dsaService.findAllChapters();
  }

  @Get('chapters/:id')
  async getChapterById(@Param('id') id: string) {
    return this.dsaService.findChapterById(id);
  }

  @Get('chapters/:chapterId/topics')
  async getTopicsByChapter(@Param('chapterId') chapterId: string) {
    return this.dsaService.findTopicsByChapter(chapterId);
  }

  // Topic endpoints - Admin only for creation
  @Post('topics')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async createTopic(@Body() createTopicDto: CreateTopicDto) {
    return this.dsaService.createTopic(createTopicDto);
  }

  @Get('topics')
  async getAllTopics() {
    return this.dsaService.findAllTopics();
  }

  @Get('topics/:id')
  async getTopicById(@Param('id') id: string) {
    return this.dsaService.findTopicById(id);
  }

  // Problem endpoints - Admin only for creation
  @Post('problems')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async createProblem(@Body() createProblemDto: CreateProblemDto) {
    return this.dsaService.createProblem(createProblemDto);
  }

  @Get('problems')
  async getAllProblems() {
    return this.dsaService.findAllProblems();
  }

  @Get('problems/:id')
  async getProblemById(@Param('id') id: string) {
    return this.dsaService.findProblemById(id);
  }

  @Get('topics/:topicId/problems')
  async getProblemsByTopic(@Param('topicId') topicId: string) {
    return this.dsaService.findProblemsByTopic(topicId);
  }

  // Progress endpoints - User specific
  @Patch('progress/:problemId')
  async updateProgress(
    @Param('problemId') problemId: string,
    @Body() updateProgressDto: UpdateProgressDto,
    @Req() req: Request
  ) {
    const userId = (req as any).user?._id;
    if (!userId) {
      throw new UnauthorizedException('User not logged in');
    }
    
    return this.dsaService.updateUserProgress(
      userId,
      problemId,
      updateProgressDto
    );
  }

  @Get('progress')
  async getUserProgress(@Req() req: Request) {
    const userId = (req as any).user?._id;
    if (!userId) {
      throw new UnauthorizedException('User not logged in');
    }
    
    return this.dsaService.getUserProgress(userId);
  }

  @Get('progress/topic/:topicId')
  async getUserProgressForTopic(
    @Param('topicId') topicId: string,
    @Req() req: Request
  ) {
    const userId = (req as any).user?._id;
    if (!userId) {
      throw new UnauthorizedException('User not logged in');
    }
    
    return this.dsaService.getUserProgressForTopic(userId, topicId);
  }

  // DSA Sheet with progress - Main endpoint for frontend
  @Get('sheet')
  async getDsaSheetWithProgress(@Req() req: Request) {
    const userId = (req as any).user?._id;
    if (!userId) {
      throw new UnauthorizedException('User not logged in');
    }
    
    return this.dsaService.getDsaSheetWithProgress(userId);
  }

  // User statistics
  @Get('stats')
  async getUserStats(@Req() req: Request) {
    const userId = (req as any).user?._id;
    if (!userId) {
      throw new UnauthorizedException('User not logged in');
    }
    
    return this.dsaService.getUserStats(userId);
  }

  // Additional endpoints
  @Get('bookmarks')
  async getBookmarkedProblems(@Req() req: Request) {
    const userId = (req as any).user?._id;
    if (!userId) {
      throw new UnauthorizedException('User not logged in');
    }
    
    return this.dsaService.getBookmarkedProblems(userId);
  }

  @Post('progress/bulk')
  async bulkUpdateProgress(
    @Body() updates: { problemId: string; updateData: UpdateProgressDto }[],
    @Req() req: Request
  ) {
    const userId = (req as any).user?._id;
    if (!userId) {
      throw new UnauthorizedException('User not logged in');
    }
    
    return this.dsaService.bulkUpdateProgress(userId, updates);
  }

  @Get('search')
  async searchProblems(
    @Query('q') query?: string,
    @Query('difficulty') difficulty?: string,
    @Query('tags') tags?: string
  ) {
    const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : undefined;
    return this.dsaService.searchProblems(query, difficulty, tagArray);
  }
}