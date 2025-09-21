import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DsaController } from './dsa.controller';
import { DsaService } from './dsa.service';
import { 
  Chapter, 
  ChapterSchema, 
  Topic, 
  TopicSchema, 
  Problem, 
  ProblemSchema, 
  UserProgress, 
  UserProgressSchema 
} from './schemas/dsa.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chapter.name, schema: ChapterSchema },
      { name: Topic.name, schema: TopicSchema },
      { name: Problem.name, schema: ProblemSchema },
      { name: UserProgress.name, schema: UserProgressSchema },
    ]),
  ],
  controllers: [DsaController],
  providers: [DsaService],
  exports: [DsaService],
})
export class DsaModule {}