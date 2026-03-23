const mongoose = require('mongoose')

// schema for storing interview sessions
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
    interviewType: {
        type: String,
        enum: ['technical', 'behavioral', 'mixed'],
        default: 'mixed'
    },
    // storing questions and answers
    questions: [{
        question: String,
        answer: String,
        questionType: String,
        score: Number
    }],
    // overall feedback
    feedback: {
        overallScore: {
            type: Number,
            default: 0
        },
        technicalScore: Number,
        communicationScore: Number,
        strengths: [String],
        improvements: [String],
        detailedFeedback: String
    },
    // metadata
    duration: Number,  // in minutes
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'abandoned'],
        default: 'in-progress'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date
})

const Interview = mongoose.model('Interview', interviewSchema)

module.exports = Interview