const mongoose = require('mongoose');

const practiceActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    activities: {
        dsa: {
            practiced: {
                type: Boolean,
                default: false
            },
            problemsSolved: {
                type: Number,
                default: 0
            }
        },
        interview: {
            practiced: {
                type: Boolean,
                default: false
            },
            sessionsCompleted: {
                type: Number,
                default: 0
            }
        },
        aptitude: {
            practiced: {
                type: Boolean,
                default: false
            },
            testsCompleted: {
                type: Number,
                default: 0
            }
        }
    }
}, {
    timestamps: true
});

// Compound index to ensure one document per user per day
practiceActivitySchema.index({ user: 1, date: 1 }, { unique: true });

// Helper method to check if any activity happened on this day
practiceActivitySchema.methods.hasPractice = function () {
    return this.activities.dsa.practiced ||
        this.activities.interview.practiced ||
        this.activities.aptitude.practiced;
};

module.exports = mongoose.model('PracticeActivity', practiceActivitySchema);