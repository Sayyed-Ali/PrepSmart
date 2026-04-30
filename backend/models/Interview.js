const mongoose = require('mongoose');

// Question subdocument schema
const questionSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    type: {
        type: String,
        enum: ['technical', 'behavioral', 'mixed'],
        required: true
    },
    expectedAnswer: {
        type: String,
        default: ''
    },
    userAnswer: {
        type: String,
        default: ''
    },
    evaluation: {
        score: {
            type: Number,
            min: 0,
            max: 10
        },
        strengths: [String],
        improvements: [String],
        idealApproach: String
    },
    timeTaken: {
        type: Number,
        default: 0
    }
}, { _id: false });

// Main Interview schema
const interviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['technical', 'behavioral', 'mixed'],
        required: true
    },
    jobDescription: {
        type: String,
        default: ''
    },
    resumeText: {
        type: String,
        default: ''
    },
    resumeFileName: {
        type: String,
        default: ''
    },
    questions: [questionSchema],
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'abandoned'],
        default: 'in-progress'
    },
    overallScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    feedback: {
        strengths: [String],
        improvements: [String],
        recommendations: [String]
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    },
    duration: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;