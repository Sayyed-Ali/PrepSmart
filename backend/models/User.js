const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// user schema - defines structure of user data
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false  // dont return password by default in queries
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    // storing some basic stats
    stats: {
        interviewsCompleted: {
            type: Number,
            default: 0
        },
        averageScore: {
            type: Number,
            default: 0
        },
        timeSpent: {
            type: Number,
            default: 0  // in hours
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// hash password before saving to database
// NOTE: Mongoose 6+ doesn't need next() callback - just use async/await
userSchema.pre('save', async function () {
    // only hash if password is modified
    if (!this.isModified('password')) {
        return
    }

    // generate salt and hash password
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// method to compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User