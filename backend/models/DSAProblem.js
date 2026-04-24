const mongoose = require('mongoose');

const dsaProblemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Graph', 'Arrays & Hashing', 'Two Pointers', 'Stack', 'Binary Search', 'Sliding Window', 'Linked List', 'Trees', 'Tries', 'Heap / Priority Queue', 'Backtracking', 'Graphs', 'Advanced Graphs', '1-D DP', '2-D DP', 'Greedy', 'Intervals', 'Math & Geometry', 'Bit Manipulation']
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['Easy', 'Medium', 'Hard']
    },
    company: {
        type: String,
        required: true,
        default: 'Amazon'
    },
    companies: [{
        type: String
    }],
    leetcodeLink: {
        type: String,
        required: true
    },
    articleLink: {
        type: String,
        default: ''
    },
    youtubeLink: {
        type: String,
        default: ''
    },
    estimatedTime: {
        type: Number, // in minutes
        default: 30
    },
    approaches: {
        bruteForce: {
            type: String,
            default: ''
        },
        better: {
            type: String,
            default: ''
        },
        optimal: {
            type: String,
            default: ''
        }
    },
    // User-specific data will be stored separately
    isPremium: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DSAProblem', dsaProblemSchema);