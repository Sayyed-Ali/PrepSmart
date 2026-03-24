const mongoose = require('mongoose')

// schema for aptitude questions
const aptitudeQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['quantitative', 'logical', 'verbal', 'general'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    options: [{
        text: String,
        isCorrect: Boolean
    }],
    correctAnswer: {
        type: String,
        required: true
    },
    explanation: String,
    timeLimit: {
        type: Number,
        default: 60  // seconds
    },
    createdBy: {
        type: String,
        enum: ['admin', 'ai'],
        default: 'admin'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const AptitudeQuestion = mongoose.model('AptitudeQuestion', aptitudeQuestionSchema)

module.exports = AptitudeQuestion