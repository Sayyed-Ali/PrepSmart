const mongoose = require('mongoose');

const vacancySchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
        default: 'Full-time'
    },
    experience: {
        type: String,
        required: true
    },
    salary: {
        type: String
    },
    deadline: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{
        type: String
    }],
    skills: [{
        type: String
    }],
    applyLink: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'closed', 'draft'],
        default: 'active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Vacancy', vacancySchema);