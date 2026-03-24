const express = require('express')
const router = express.Router()
const AptitudeQuestion = require('../models/AptitudeQuestion')
const AptitudeTest = require('../models/AptitudeTest')
const { generateAptitudeQuestions } = require('../services/aiService')

// POST /api/aptitude/generate - generate questions using AI
router.post('/generate', async (req, res) => {
    try {
        const { category, difficulty, count } = req.body

        // validate inputs
        if (!category || !difficulty) {
            return res.status(400).json({
                success: false,
                message: 'Category and difficulty are required'
            })
        }

        console.log(`Generating ${count || 10} ${difficulty} ${category} questions...`)

        // generate questions using AI service
        const questions = await generateAptitudeQuestions(
            category,
            difficulty,
            count || 10
        )

        res.json({
            success: true,
            count: questions.length,
            questions
        })

    } catch (error) {
        console.error('Error generating questions:', error)
        res.status(500).json({
            success: false,
            message: 'Error generating questions'
        })
    }
})

// POST /api/aptitude/submit - submit test results
router.post('/submit', async (req, res) => {
    try {
        const { userId, category, difficulty, questions, timeTaken } = req.body

        // calculate score
        let correct = 0
        let incorrect = 0

        questions.forEach(q => {
            if (q.isCorrect) correct++
            else incorrect++
        })

        const total = questions.length
        const percentage = ((correct / total) * 100).toFixed(2)

        // save test result
        const test = await AptitudeTest.create({
            user: userId,
            category,
            difficulty,
            questions,
            score: {
                total,
                correct,
                incorrect,
                percentage
            },
            timeTaken
        })

        console.log('Test submitted:', test._id)

        res.json({
            success: true,
            message: 'Test submitted successfully',
            result: {
                testId: test._id,
                score: test.score,
                timeTaken: test.timeTaken
            }
        })

    } catch (error) {
        console.error('Error submitting test:', error)
        res.status(500).json({
            success: false,
            message: 'Error submitting test'
        })
    }
})

// GET /api/aptitude/results/:userId - get user's test history
router.get('/results/:userId', async (req, res) => {
    try {
        const tests = await AptitudeTest.find({ user: req.params.userId })
            .sort({ completedAt: -1 })
            .limit(10)

        res.json({
            success: true,
            count: tests.length,
            tests
        })

    } catch (error) {
        console.error('Error fetching results:', error)
        res.status(500).json({
            success: false,
            message: 'Error fetching results'
        })
    }
})

// GET /api/aptitude/result/:testId - get specific test result
router.get('/result/:testId', async (req, res) => {
    try {
        const test = await AptitudeTest.findById(req.params.testId)

        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Test not found'
            })
        }

        res.json({
            success: true,
            test
        })

    } catch (error) {
        console.error('Error fetching test:', error)
        res.status(500).json({
            success: false,
            message: 'Error fetching test'
        })
    }
})

module.exports = router