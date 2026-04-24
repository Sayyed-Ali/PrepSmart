const mongoose = require('mongoose');

const userDSAProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DSAProblem',
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    isFavorite: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Ensure one progress record per user per problem
userDSAProgressSchema.index({ user: 1, problem: 1 }, { unique: true });

module.exports = mongoose.model('UserDSAProgress', userDSAProgressSchema);