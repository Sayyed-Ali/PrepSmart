const mongoose = require('mongoose')

// company data schema
const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    logo: String,
    description: String,
    industry: String,
    founded: String,
    founders: [String],
    headquarters: String,

    // interview related info
    interviewProcess: {
        rounds: [{
            name: String,
            description: String,
            duration: String
        }],
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'medium'
        }
    },

    // commonly asked questions
    commonQuestions: [{
        question: String,
        type: String,  // technical, behavioral, hr
        difficulty: String
    }],

    // company culture
    culture: {
        values: [String],
        workEnvironment: String,
        benefits: [String]
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Company = mongoose.model('Company', companySchema)

module.exports = Company