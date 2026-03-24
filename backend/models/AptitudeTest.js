const mongoose = require('mongoose')

// schema for storing test results
const aptitudeTestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: String,
    difficulty: String,
    questions: [{
        questionId: String,
        question: String,
        options: [String],
        userAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean,
        timeTaken: Number  // in seconds
    }],
    score: {
        total: Number,
        correct: Number,
        incorrect: Number,
        percentage: Number
    },
    timeTaken: Number,  // total time in seconds
    completedAt: {
        type: Date,
        default: Date.now
    }
})

const AptitudeTest = mongoose.model('AptitudeTest', aptitudeTestSchema)

module.exports = AptitudeTest