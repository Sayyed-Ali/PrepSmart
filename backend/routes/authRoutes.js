const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')

// generate jwt token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'  // token valid for 7 days
    })
}

// POST /api/auth/signup - register new user
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body

        // basic validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            })
        }

        // check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            })
        }

        // create new user
        const user = await User.create({
            name,
            email,
            password  // will be hashed by pre-save hook
        })

        // generate token
        const token = generateToken(user._id)

        console.log('New user registered:', email)

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        console.error('Signup error:', error)
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        })
    }
})

// POST /api/auth/login - user login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        // validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            })
        }

        // find user and include password field
        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        // check password
        const isPasswordCorrect = await user.comparePassword(password)

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        // generate token
        const token = generateToken(user._id)

        console.log('User logged in:', email)

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                stats: user.stats
            }
        })

    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        })
    }
})

module.exports = router