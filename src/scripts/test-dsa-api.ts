import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DsaService } from '../dsa/dsa.service';
import { SolutionStatus } from '../dsa/schemas/dsa.schema';

async function testDsaApi() {
  console.log('🧪 Testing DSA API functionality...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const dsaService = app.get(DsaService);

  try {
    // Test 1: Get all chapters
    console.log('\n📖 Testing: Get all chapters');
    const chapters = await dsaService.findAllChapters();
    console.log(`✅ Found ${chapters.length} chapters:`);
    chapters.forEach(chapter => {
      console.log(`   - ${chapter.name} (Order: ${chapter.order})`);
    });

    // Test 2: Get all topics
    console.log('\n📚 Testing: Get all topics');
    const topics = await dsaService.findAllTopics();
    console.log(`✅ Found ${topics.length} topics:`);
    topics.slice(0, 5).forEach(topic => {
      console.log(`   - ${topic.name} (Chapter: ${topic.chapterId.toString()})`);
    });
    if (topics.length > 5) {
      console.log(`   ... and ${topics.length - 5} more topics`);
    }

    // Test 3: Get problems for Arrays topic
    console.log('\n💻 Testing: Get problems for Arrays topic');
    const arrayTopic = topics.find(t => t.name === 'Arrays');
    if (arrayTopic) {
      const arrayProblems = await dsaService.findProblemsByTopic(arrayTopic._id.toString());
      console.log(`✅ Found ${arrayProblems.length} problems for Arrays:`);
      arrayProblems.forEach(problem => {
        console.log(`   - ${problem.title} (${problem.difficulty})`);
        console.log(`     LeetCode: ${problem.leetcodeLink || 'N/A'}`);
        console.log(`     YouTube: ${problem.youtubeLink || 'N/A'}`);
        console.log(`     Time Complexity: ${problem.timeComplexity || 'N/A'}`);
        console.log(`     Tags: ${problem.tags?.join(', ') || 'N/A'}`);
        console.log('');
      });
    }

    // Test 4: Create a sample user progress (using a dummy user ID)
    console.log('\n📈 Testing: User progress functionality');
    const dummyUserId = '64f8a1234567890123456789'; // Dummy user ID for testing
    const sampleProblemId = topics[0] ? 
      (await dsaService.findProblemsByTopic(topics[0]._id.toString()))[0]?._id.toString() : null;
    
    if (sampleProblemId) {
      console.log(`   Testing with problem ID: ${sampleProblemId}`);
      
      // Update progress
      const progress = await dsaService.updateUserProgress(dummyUserId, sampleProblemId, {
        isCompleted: true,
        status: SolutionStatus.SOLVED_INDEPENDENTLY,
        notes: 'Solved using two-pointer technique',
        timeSpent: 45,
        difficultyRating: 3
      });
      console.log('✅ Successfully updated user progress');

      // Get user progress
      const userProgress = await dsaService.getUserProgress(dummyUserId);
      console.log(`✅ Retrieved user progress: ${userProgress.length} entries`);
    }

    // Test 5: Get complete DSA sheet with progress
    console.log('\n📊 Testing: Complete DSA sheet with progress');
    const dsaSheet = await dsaService.getDsaSheetWithProgress(dummyUserId);
    console.log(`✅ Generated DSA sheet with ${dsaSheet.length} chapters:`);
    dsaSheet.slice(0, 2).forEach(chapter => {
      console.log(`   Chapter: ${chapter.name}`);
      console.log(`   Topics: ${chapter.topics.length}, Total Problems: ${chapter.totalProblems}`);
      console.log(`   Progress: ${chapter.completedProblems}/${chapter.totalProblems} (${chapter.completionPercentage}%)`);
      console.log('');
    });

    // Test 6: Get user statistics
    console.log('\n📈 Testing: User statistics');
    const stats = await dsaService.getUserStats(dummyUserId);
    console.log('✅ User Statistics:');
    console.log(`   Total Problems: ${stats.totalProblems}`);
    console.log(`   Completed: ${stats.completedProblems}`);
    console.log(`   Remaining: ${stats.remainingProblems}`);
    console.log(`   Overall Progress: ${stats.completionPercentage}%`);
    console.log(`   Difficulty Breakdown:`, stats.difficultyStats);

    // Test 7: Search functionality
    console.log('\n🔍 Testing: Search functionality');
    const searchResults = await dsaService.searchProblems('array', 'Easy');
    console.log(`✅ Search results for "array" + "Easy": ${searchResults.length} problems`);
    searchResults.slice(0, 3).forEach(problem => {
      console.log(`   - ${problem.title} (${problem.difficulty})`);
    });

    console.log('\n🎉 All DSA API tests completed successfully!');
    console.log('\n📋 Summary of available endpoints:');
    console.log('   GET /api/v1/dsa/chapters - Get all chapters');
    console.log('   GET /api/v1/dsa/chapters/:id/topics - Get topics by chapter');
    console.log('   GET /api/v1/dsa/topics - Get all topics');
    console.log('   GET /api/v1/dsa/problems - Get all problems');
    console.log('   GET /api/v1/dsa/topics/:topicId/problems - Get problems by topic');
    console.log('   GET /api/v1/dsa/sheet - Get complete DSA sheet with progress');
    console.log('   PATCH /api/v1/dsa/progress/:problemId - Update problem progress');
    console.log('   GET /api/v1/dsa/progress - Get user progress');
    console.log('   GET /api/v1/dsa/stats - Get user statistics');
    console.log('   GET /api/v1/dsa/bookmarks - Get bookmarked problems');
    console.log('   GET /api/v1/dsa/search?q=query&difficulty=Easy&tags=array - Search problems');
    console.log('   POST /api/v1/dsa/progress/bulk - Bulk update progress');

  } catch (error) {
    console.error('❌ Error during API testing:', error);
  } finally {
    await app.close();
  }
}

testDsaApi();