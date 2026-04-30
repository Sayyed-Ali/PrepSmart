const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const DSAProblem = require('../models/DSAProblem');

// MongoDB connection
const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
    console.error(' MONGODB_URI not found in .env file!');
    console.error(' Make sure backend/.env exists and has MONGODB_URI defined');
    process.exit(1);
}

console.log('🔗 Connecting to MongoDB Atlas...');

const amazonProblems = [
    {
        title: 'Majority Element',
        category: 'Arrays & Hashing',
        difficulty: 'Easy',
        company: 'Amazon',
        companies: ['Amazon', 'Google', 'Microsoft'],
        leetcodeLink: 'https://leetcode.com/problems/majority-element/',
        articleLink: '',
        youtubeLink: '',
        estimatedTime: 30,
        approaches: {
            bruteForce: 'Use two nested loops to count frequency of each element. Time: O(n²), Space: O(1)',
            better: 'Use a hash map to store frequencies. Time: O(n), Space: O(n)',
            optimal: 'Boyer-Moore Voting Algorithm. Time: O(n), Space: O(1)'
        }
    },
    {
        title: 'Two Sum',
        category: 'Arrays & Hashing',
        difficulty: 'Easy',
        company: 'Amazon',
        companies: ['Amazon', 'Google', 'Facebook', 'Microsoft', 'Apple'],
        leetcodeLink: 'https://leetcode.com/problems/two-sum/',
        articleLink: '',
        youtubeLink: '',
        estimatedTime: 30,
        approaches: {
            bruteForce: 'Check all pairs using nested loops. Time: O(n²), Space: O(1)',
            better: 'Sort array and use two pointers. Time: O(n log n), Space: O(1)',
            optimal: 'Use hash map to store complements. Time: O(n), Space: O(n)'
        }
    },
    {
        title: 'Number of Islands',
        category: 'Graph',
        difficulty: 'Medium',
        company: 'Amazon',
        companies: ['Amazon', 'Google', 'Facebook', 'Microsoft'],
        leetcodeLink: 'https://leetcode.com/problems/number-of-islands/',
        articleLink: '',
        youtubeLink: '',
        estimatedTime: 45,
        approaches: {
            bruteForce: 'Visit each cell and mark connected land cells. Time: O(m×n), Space: O(m×n)',
            better: 'Use DFS to explore islands. Time: O(m×n), Space: O(m×n) for recursion stack',
            optimal: 'Use BFS with queue or DFS with iterative approach. Time: O(m×n), Space: O(min(m,n))'
        }
    },
    {
        title: 'Longest Substring Without Repeating Characters',
        category: 'Sliding Window',
        difficulty: 'Medium',
        company: 'Amazon',
        companies: ['Amazon', 'Google', 'Adobe', 'Facebook'],
        leetcodeLink: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        articleLink: '',
        youtubeLink: '',
        estimatedTime: 40,
        approaches: {
            bruteForce: 'Check all substrings for uniqueness. Time: O(n³), Space: O(min(m,n))',
            better: 'Use sliding window with set. Time: O(2n) = O(n), Space: O(min(m,n))',
            optimal: 'Optimized sliding window with map storing indices. Time: O(n), Space: O(min(m,n))'
        }
    }
];

async function seedDSAProblems() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log(' Connected to MongoDB Atlas');

        // Clear existing DSA problems
        const deleted = await DSAProblem.deleteMany({});
        console.log(`  Cleared ${deleted.deletedCount} existing DSA problems`);

        // Insert Amazon problems
        const inserted = await DSAProblem.insertMany(amazonProblems);
        console.log(` Inserted ${inserted.length} Amazon DSA problems`);

        console.log('\n Problems added:');
        inserted.forEach((problem, index) => {
            console.log(`${index + 1}. ${problem.title} (${problem.difficulty}) - ${problem.category}`);
        });

        await mongoose.connection.close();
        console.log('\n Seed completed successfully!');
    } catch (error) {
        console.error(' Error seeding data:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    seedDSAProblems();
}

module.exports = seedDSAProblems;