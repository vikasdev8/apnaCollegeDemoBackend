import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DsaService } from '../dsa/dsa.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dsaService = app.get(DsaService);

  console.log('🌱 Starting comprehensive DSA data seeding...');

  try {
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
      {
        name: 'Stacks and Queues',
        description: 'LIFO and FIFO data structures with their applications',
        chapterId: basicDSChapter._id.toString(),
        order: 4,
      },
      // Advanced Data Structures
      {
        name: 'Binary Trees',
        description: 'Binary tree operations, traversals, and tree-based problems',
        chapterId: advancedDSChapter._id.toString(),
        order: 1,
      },
      {
        name: 'Binary Search Trees',
        description: 'BST operations, validation, and balanced tree concepts',
        chapterId: advancedDSChapter._id.toString(),
        order: 2,
      },
      {
        name: 'Heaps',
        description: 'Min-heap, max-heap operations and priority queue problems',
        chapterId: advancedDSChapter._id.toString(),
        order: 3,
      },
      {
        name: 'Hash Tables',
        description: 'Hashing techniques, collision resolution, and hash-based problems',
        chapterId: advancedDSChapter._id.toString(),
        order: 4,
      },
      // Algorithms
      {
        name: 'Sorting Algorithms',
        description: 'Various sorting techniques and their applications',
        chapterId: algorithmsChapter._id.toString(),
        order: 1,
      },
      {
        name: 'Searching Algorithms',
        description: 'Binary search and its variations',
        chapterId: algorithmsChapter._id.toString(),
        order: 2,
      },
      {
        name: 'Two Pointers',
        description: 'Two pointer technique for array and string problems',
        chapterId: algorithmsChapter._id.toString(),
        order: 3,
      },
      {
        name: 'Sliding Window',
        description: 'Sliding window technique for subarray problems',
        chapterId: algorithmsChapter._id.toString(),
        order: 4,
      },
      // Dynamic Programming
      {
        name: 'Basic DP',
        description: 'Fundamental dynamic programming concepts and problems',
        chapterId: dpChapter._id.toString(),
        order: 1,
      },
      {
        name: '2D DP',
        description: 'Two-dimensional dynamic programming problems',
        chapterId: dpChapter._id.toString(),
        order: 2,
      },
      {
        name: 'DP on Strings',
        description: 'Dynamic programming on string problems',
        chapterId: dpChapter._id.toString(),
        order: 3,
      },
      // Graph Theory
      {
        name: 'Graph Basics',
        description: 'Graph representation and basic traversal algorithms',
        chapterId: graphChapter._id.toString(),
        order: 1,
      },
      {
        name: 'Shortest Path',
        description: 'Dijkstra, Bellman-Ford, and Floyd-Warshall algorithms',
        chapterId: graphChapter._id.toString(),
        order: 2,
      },
      // Mathematical Algorithms
      {
        name: 'Number Theory',
        description: 'Prime numbers, GCD, LCM, and modular arithmetic',
        chapterId: mathChapter._id.toString(),
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

    // Create comprehensive problems with all details
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
        articleLink: 'https://www.geeksforgeeks.org/given-an-array-a-and-a-number-x-check-for-pair-in-a-with-sum-as-x/',
        geeksforgeeksLink: 'https://www.geeksforgeeks.org/given-an-array-a-and-a-number-x-check-for-pair-in-a-with-sum-as-x/',
        tags: ['array', 'hash-table', 'two-sum'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        order: 1,
      },
      {
        title: 'Best Time to Buy and Sell Stock',
        description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit.',
        topicId: arrayTopic._id.toString(),
        difficulty: 'Easy' as const,
        leetcodeLink: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
        youtubeLink: 'https://www.youtube.com/watch?v=1pkOgXD63yU',
        geeksforgeeksLink: 'https://www.geeksforgeeks.org/stock-buy-sell/',
        tags: ['array', 'dynamic-programming'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        order: 2,
      },
      {
        title: 'Maximum Subarray (Kadane\'s Algorithm)',
        description: 'Given an integer array nums, find the contiguous subarray with the largest sum and return its sum.',
        topicId: arrayTopic._id.toString(),
        difficulty: 'Medium' as const,
        leetcodeLink: 'https://leetcode.com/problems/maximum-subarray/',
        youtubeLink: 'https://www.youtube.com/watch?v=5WZl3MMT0Eg',
        geeksforgeeksLink: 'https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/',
        tags: ['array', 'divide-and-conquer', 'dynamic-programming'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        order: 3,
      },
      {
        title: 'Contains Duplicate',
        description: 'Given an integer array nums, return true if any value appears at least twice in the array.',
        topicId: arrayTopic._id.toString(),
        difficulty: 'Easy' as const,
        leetcodeLink: 'https://leetcode.com/problems/contains-duplicate/',
        youtubeLink: 'https://www.youtube.com/watch?v=3OamzN90kPg',
        geeksforgeeksLink: 'https://www.geeksforgeeks.org/find-duplicates-in-on-time-and-constant-extra-space/',
        tags: ['array', 'hash-table', 'sorting'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        order: 4,
      },
      {
        title: 'Product of Array Except Self',
        description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].',
        topicId: arrayTopic._id.toString(),
        difficulty: 'Medium' as const,
        leetcodeLink: 'https://leetcode.com/problems/product-of-array-except-self/',
        youtubeLink: 'https://www.youtube.com/watch?v=bNvIQI2wAjk',
        geeksforgeeksLink: 'https://www.geeksforgeeks.org/a-product-array-puzzle/',
        tags: ['array', 'prefix-sum'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        order: 5,
      },
    ];

    // Strings problems
    const stringTopic = createdTopics.find(t => t.name === 'Strings');
    const stringProblems = [
      {
        title: 'Valid Palindrome',
        description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
        topicId: stringTopic._id.toString(),
        difficulty: 'Easy' as const,
        leetcodeLink: 'https://leetcode.com/problems/valid-palindrome/',
        youtubeLink: 'https://www.youtube.com/watch?v=jJXJ16kPFWg',
        geeksforgeeksLink: 'https://www.geeksforgeeks.org/c-program-check-given-string-palindrome/',
        tags: ['string', 'two-pointers'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        order: 1,
      },
      {
        title: 'Valid Anagram',
        description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
        topicId: stringTopic._id.toString(),
        difficulty: 'Easy' as const,
        leetcodeLink: 'https://leetcode.com/problems/valid-anagram/',
        youtubeLink: 'https://www.youtube.com/watch?v=9UtInBqnCgA',
        geeksforgeeksLink: 'https://www.geeksforgeeks.org/check-whether-two-strings-are-anagram-of-each-other/',
        tags: ['string', 'hash-table', 'sorting'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        order: 2,
      },
      {
        title: 'Longest Palindromic Substring',
        description: 'Given a string s, return the longest palindromic substring in s.',
        topicId: stringTopic._id.toString(),
        difficulty: 'Medium' as const,
        leetcodeLink: 'https://leetcode.com/problems/longest-palindromic-substring/',
        youtubeLink: 'https://www.youtube.com/watch?v=XYQecbcd6_c',
        geeksforgeeksLink: 'https://www.geeksforgeeks.org/longest-palindrome-substring-set-1/',
        tags: ['string', 'dynamic-programming'],
        timeComplexity: 'O(n^2)',
        spaceComplexity: 'O(1)',
        order: 3,
      },
      {
        title: 'Group Anagrams',
        description: 'Given an array of strings strs, group the anagrams together.',
        topicId: stringTopic._id.toString(),
        difficulty: 'Medium' as const,
        leetcodeLink: 'https://leetcode.com/problems/group-anagrams/',
        youtubeLink: 'https://www.youtube.com/watch?v=vzdNOK2oB2E',
        geeksforgeeksLink: 'https://www.geeksforgeeks.org/given-a-sequence-of-words-print-all-anagrams-together/',
        tags: ['string', 'hash-table', 'sorting'],
        timeComplexity: 'O(n * k log k)',
        spaceComplexity: 'O(n * k)',
        order: 4,
      },
    ];

    // Dynamic Programming problems
    const dpTopic = createdTopics.find(t => t.name === 'Basic DP');
    const dpProblems = [
      {
        title: 'Fibonacci Number',
        description: 'The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence.',
        topicId: dpTopic._id.toString(),
        difficulty: 'Easy' as const,
        leetcodeLink: 'https://leetcode.com/problems/fibonacci-number/',
        youtubeLink: 'https://www.youtube.com/watch?v=oBt53YbR9Kk',
        geeksforgeeksLink: 'https://www.geeksforgeeks.org/program-for-nth-fibonacci-number/',
        tags: ['math', 'dynamic-programming', 'recursion', 'memoization'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        order: 1,
      },
      {
        title: 'Climbing Stairs',
        description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps.',
        topicId: dpTopic._id.toString(),
        difficulty: 'Easy' as const,
        leetcodeLink: 'https://leetcode.com/problems/climbing-stairs/',
        youtubeLink: 'https://www.youtube.com/watch?v=Y0lT9Fck7qI',
        geeksforgeeksLink: 'https://www.geeksforgeeks.org/count-ways-reach-nth-stair/',
        tags: ['math', 'dynamic-programming', 'memoization'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        order: 2,
      },
      {
        title: 'House Robber',
        description: 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed.',
        topicId: dpTopic._id.toString(),
        difficulty: 'Medium' as const,
        leetcodeLink: 'https://leetcode.com/problems/house-robber/',
        youtubeLink: 'https://www.youtube.com/watch?v=xlvhyfcoQa4',
        geeksforgeeksLink: 'https://www.geeksforgeeks.org/find-maximum-sum-such-that-no-two-elements-are-adjacent/',
        tags: ['array', 'dynamic-programming'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        order: 3,
      },
      {
        title: 'Coin Change',
        description: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.',
        topicId: dpTopic._id.toString(),
        difficulty: 'Medium' as const,
        leetcodeLink: 'https://leetcode.com/problems/coin-change/',
        youtubeLink: 'https://www.youtube.com/watch?v=H9bfqozjoqs',
        geeksforgeeksLink: 'https://www.geeksforgeeks.org/coin-change-dp-7/',
        tags: ['array', 'dynamic-programming', 'breadth-first-search'],
        timeComplexity: 'O(n * amount)',
        spaceComplexity: 'O(amount)',
        order: 4,
      },
    ];

    // Binary Trees problems
    const treeTopic = createdTopics.find(t => t.name === 'Binary Trees');
    const treeProblems = [
      {
        title: 'Maximum Depth of Binary Tree',
        description: 'Given the root of a binary tree, return its maximum depth.',
        topicId: treeTopic._id.toString(),
        difficulty: 'Easy' as const,
        leetcodeLink: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
        youtubeLink: 'https://www.youtube.com/watch?v=hTM3phVI6YQ',
        geeksforgeeksLink: 'https://www.geeksforgeeks.org/write-a-c-program-to-find-the-maximum-depth-or-height-of-a-tree/',
        tags: ['tree', 'depth-first-search', 'breadth-first-search', 'binary-tree'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h)',
        order: 1,
      },
      {
        title: 'Invert Binary Tree',
        description: 'Given the root of a binary tree, invert the tree, and return its root.',
        topicId: treeTopic._id.toString(),
        difficulty: 'Easy' as const,
        leetcodeLink: 'https://leetcode.com/problems/invert-binary-tree/',
        youtubeLink: 'https://www.youtube.com/watch?v=OnSn2XEQ4MY',
        geeksforgeeksLink: 'https://www.geeksforgeeks.org/write-an-efficient-c-function-to-convert-a-tree-into-its-mirror-tree/',
        tags: ['tree', 'depth-first-search', 'breadth-first-search', 'binary-tree'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h)',
        order: 2,
      },
      {
        title: 'Binary Tree Level Order Traversal',
        description: 'Given the root of a binary tree, return the level order traversal of its nodes\' values.',
        topicId: treeTopic._id.toString(),
        difficulty: 'Medium' as const,
        leetcodeLink: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
        youtubeLink: 'https://www.youtube.com/watch?v=6ZnyEApgFYg',
        geeksforgeeksLink: 'https://www.geeksforgeeks.org/level-order-tree-traversal/',
        tags: ['tree', 'breadth-first-search', 'binary-tree'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(w)',
        order: 3,
      },
    ];

    const allProblems = [...arrayProblems, ...stringProblems, ...dpProblems, ...treeProblems];
    
    for (const problem of allProblems) {
      await dsaService.createProblem(problem);
      console.log(`✅ Created problem: ${problem.title}`);
    }

    console.log('🎉 Comprehensive DSA data seeding completed successfully!');
    console.log(`📊 Created ${chapters.length} chapters, ${topics.length} topics, and ${allProblems.length} problems`);
    
  } catch (error) {
    console.error('❌ Error seeding DSA data:', error);
  } finally {
    await app.close();
  }
}

seed();