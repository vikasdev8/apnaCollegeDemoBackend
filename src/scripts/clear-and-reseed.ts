import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DsaService } from '../dsa/dsa.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chapter, ChapterDocument, Topic, TopicDocument, Problem, ProblemDocument, UserProgress, UserProgressDocument } from '../dsa/schemas/dsa.schema';

async function clearAndReseed() {
  console.log('🧹 Starting database cleanup and re-seeding...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const dsaService = app.get(DsaService);

  // Get models directly for cleanup
  const chapterModel = app.get('ChapterModel') as Model<ChapterDocument>;
  const topicModel = app.get('TopicModel') as Model<TopicDocument>;
  const problemModel = app.get('ProblemModel') as Model<ProblemDocument>;
  const userProgressModel = app.get('UserProgressModel') as Model<UserProgressDocument>;

  try {
    // Clear existing data
    console.log('🗑️ Clearing existing DSA data...');
    await userProgressModel.deleteMany({});
    await problemModel.deleteMany({});
    await topicModel.deleteMany({});
    await chapterModel.deleteMany({});
    console.log('✅ Database cleared successfully');

    // Create chapters (main categories)
    const chapters = [
      {
        name: 'Basic Data Structures',
        description: 'Fundamental data structures every programmer should master',
        order: 1,
        icon: '🗃️',
      },
      {
        name: 'Advanced Data Structures',
        description: 'Complex data structures for efficient problem solving',
        order: 2,
        icon: '🌳',
      },
      {
        name: 'Algorithms',
        description: 'Core algorithmic paradigms and techniques',
        order: 3,
        icon: '⚙️',
      },
      {
        name: 'Dynamic Programming',
        description: 'Optimization problems using memoization and tabulation',
        order: 4,
        icon: '🧠',
      },
      {
        name: 'Graph Theory',
        description: 'Graph algorithms and network problems',
        order: 5,
        icon: '🕸️',
      },
      {
        name: 'Mathematical Algorithms',
        description: 'Number theory, geometry, and mathematical problem solving',
        order: 6,
        icon: '🧮',
      },
    ];

    console.log('📖 Creating chapters...');
    const createdChapters = [];
    for (const chapter of chapters) {
      const created = await dsaService.createChapter(chapter);
      createdChapters.push(created);
      console.log(`✅ Created chapter: ${chapter.name}`);
    }

    // Create topics for each chapter
    const basicDSChapter = createdChapters.find(c => c.name === 'Basic Data Structures');
    const advancedDSChapter = createdChapters.find(c => c.name === 'Advanced Data Structures');
    const algorithmsChapter = createdChapters.find(c => c.name === 'Algorithms');
    const dpChapter = createdChapters.find(c => c.name === 'Dynamic Programming');
    const graphChapter = createdChapters.find(c => c.name === 'Graph Theory');
    const mathChapter = createdChapters.find(c => c.name === 'Mathematical Algorithms');

    const topics = [
      // Basic Data Structures
      {
        name: 'Arrays',
        description: 'Problems related to array data structure - indexing, traversal, searching, and sorting',
        chapterId: basicDSChapter._id.toString(),
        order: 1,
      },
      {
        name: 'Strings',
        description: 'String manipulation, pattern matching, and text processing problems',
        chapterId: basicDSChapter._id.toString(),
        order: 2,
      },
      {
        name: 'Linked Lists',
        description: 'Singly, doubly, and circular linked list operations and algorithms',
        chapterId: basicDSChapter._id.toString(),
        order: 3,
      },
      // Advanced Data Structures
      {
        name: 'Binary Trees',
        description: 'Binary tree operations, traversals, and tree-based problems',
        chapterId: advancedDSChapter._id.toString(),
        order: 1,
      },
      {
        name: 'Heaps',
        description: 'Min-heap, max-heap operations and priority queue problems',
        chapterId: advancedDSChapter._id.toString(),
        order: 2,
      },
      // Algorithms
      {
        name: 'Sorting Algorithms',
        description: 'Various sorting techniques and their applications',
        chapterId: algorithmsChapter._id.toString(),
        order: 1,
      },
      {
        name: 'Two Pointers',
        description: 'Two pointer technique for array and string problems',
        chapterId: algorithmsChapter._id.toString(),
        order: 2,
      },
      // Dynamic Programming
      {
        name: 'Basic DP',
        description: 'Fundamental dynamic programming concepts and problems',
        chapterId: dpChapter._id.toString(),
        order: 1,
      },
    ];

    console.log('📚 Creating topics...');
    const createdTopics = [];
    for (const topic of topics) {
      const created = await dsaService.createTopic(topic);
      createdTopics.push(created);
      console.log(`✅ Created topic: ${topic.name}`);
    }

    // Create problems
    console.log('💻 Creating problems...');
    
    // Arrays problems
    const arrayTopic = createdTopics.find(t => t.name === 'Arrays');
    const arrayProblems = [
      {
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        topicId: arrayTopic._id.toString(),
        difficulty: 'Easy' as const,
        leetcodeLink: 'https://leetcode.com/problems/two-sum/',
        youtubeLink: 'https://www.youtube.com/watch?v=KLlXCFG5TnA',
        order: 1,
      },
      {
        title: 'Best Time to Buy and Sell Stock',
        description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day.',
        topicId: arrayTopic._id.toString(),
        difficulty: 'Easy' as const,
        leetcodeLink: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
        youtubeLink: 'https://www.youtube.com/watch?v=1pkOgXD63yU',
        order: 2,
      },
      {
        title: 'Maximum Subarray',
        description: 'Given an integer array nums, find the contiguous subarray with the largest sum.',
        topicId: arrayTopic._id.toString(),
        difficulty: 'Medium' as const,
        leetcodeLink: 'https://leetcode.com/problems/maximum-subarray/',
        youtubeLink: 'https://www.youtube.com/watch?v=5WZl3MMT0Eg',
        order: 3,
      },
    ];

    // Strings problems
    const stringTopic = createdTopics.find(t => t.name === 'Strings');
    const stringProblems = [
      {
        title: 'Valid Palindrome',
        description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters.',
        topicId: stringTopic._id.toString(),
        difficulty: 'Easy' as const,
        leetcodeLink: 'https://leetcode.com/problems/valid-palindrome/',
        youtubeLink: 'https://www.youtube.com/watch?v=jJXJ16kPFWg',
        order: 1,
      },
      {
        title: 'Valid Anagram',
        description: 'Given two strings s and t, return true if t is an anagram of s.',
        topicId: stringTopic._id.toString(),
        difficulty: 'Easy' as const,
        leetcodeLink: 'https://leetcode.com/problems/valid-anagram/',
        youtubeLink: 'https://www.youtube.com/watch?v=9UtInBqnCgA',
        order: 2,
      },
    ];

    // Dynamic Programming problems
    const dpTopic = createdTopics.find(t => t.name === 'Basic DP');
    const dpProblems = [
      {
        title: 'Fibonacci Number',
        description: 'The Fibonacci numbers form a sequence called the Fibonacci sequence.',
        topicId: dpTopic._id.toString(),
        difficulty: 'Easy' as const,
        leetcodeLink: 'https://leetcode.com/problems/fibonacci-number/',
        youtubeLink: 'https://www.youtube.com/watch?v=oBt53YbR9Kk',
        order: 1,
      },
      {
        title: 'Climbing Stairs',
        description: 'You are climbing a staircase. It takes n steps to reach the top.',
        topicId: dpTopic._id.toString(),
        difficulty: 'Easy' as const,
        leetcodeLink: 'https://leetcode.com/problems/climbing-stairs/',
        youtubeLink: 'https://www.youtube.com/watch?v=Y0lT9Fck7qI',
        order: 2,
      },
    ];

    const allProblems = [...arrayProblems, ...stringProblems, ...dpProblems];
    
    for (const problem of allProblems) {
      await dsaService.createProblem(problem);
      console.log(`✅ Created problem: ${problem.title}`);
    }

    // Verify the data
    console.log('\n📊 Verifying data...');
    const finalChapters = await dsaService.findAllChapters();
    const finalTopics = await dsaService.findAllTopics();
    const finalProblems = await problemModel.find({ isActive: true }).exec();
    
    console.log(`✅ Final count: ${finalChapters.length} chapters, ${finalTopics.length} topics, ${finalProblems.length} problems`);

    console.log('\n🎉 Database cleanup and re-seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during cleanup and re-seeding:', error);
  } finally {
    await app.close();
  }
}

clearAndReseed();