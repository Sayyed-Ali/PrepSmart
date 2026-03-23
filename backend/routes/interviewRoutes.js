const express = require('express')
const router = express.Router()
const Interview = require('../models/Interview')

// POST /api/interviews - create new interview session
router.post('/', async (req, res) => {
    try {
        const { userId, company, role, interviewType } = req.body

        const interview = await Interview.create({
            user: userId,
            company,
            role,
            interviewType
        })

        console.log('New interview created:', interview._id)

        res.status(201).json({
            success: true,
            message: 'Interview session created',
            interview
        })

    } catch (error) {
        console.error('Error creating interview:', error)
        res.status(500).json({
            success: false,
            message: 'Error creating interview session'
        })
    }
})

// GET /api/interviews/user/:userId - get all interviews for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const interviews = await Interview.find({ user: req.params.userId })
            .sort({ createdAt: -1 })  // newest first
            .limit(10)

        res.json({
            success: true,
            count: interviews.length,
            interviews
        })

    } catch (error) {
        console.error('Error fetching interviews:', error)
        res.status(500).json({
            success: false,
            message: 'Error fetching interviews'
        })
    }
})

// GET /api/interviews/:id - get specific interview
router.get('/:id', async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id)
            .populate('user', 'name email')

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            })
        }

        res.json({
            success: true,
            interview
        })

    } catch (error) {
        console.error('Error fetching interview:', error)
        res.status(500).json({
            success: false,
            message: 'Error fetching interview data'
        })
    }
})

// PUT /api/interviews/:id - update interview (add answers, feedback)
router.put('/:id', async (req, res) => {
    try {
        const { questions, feedback, status, duration } = req.body

        const interview = await Interview.findByIdAndUpdate(
            req.params.id,
            { questions, feedback, status, duration },
            { new: true, runValidators: true }
        )

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            })
        }

        console.log('Interview updated:', interview._id)

        res.json({
            success: true,
            message: 'Interview updated successfully',
            interview
        })

    } catch (error) {
        console.error('Error updating interview:', error)
        res.status(500).json({
            success: false,
            message: 'Error updating interview'
        })
    }
})

module.exports = router