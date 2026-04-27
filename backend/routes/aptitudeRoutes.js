const express = require('express')
const router = express.Router()
const AptitudeTest = require('../models/AptitudeTest')
const { generateAptitudeQuestions } = require('../services/aiService')
const AptitudeQuestion = require('../models/AptitudeQuestion');
const PracticeActivity = require('../models/PracticeActivity');
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

        //PRACTICE ACTIVITY TRACKING - START
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let activity = await PracticeActivity.findOne({
                user: userId,
                date: today
            });

            if (!activity) {
                activity = new PracticeActivity({
                    user: userId,
                    date: today,
                    activities: {
                        dsa: { practiced: false, problemsSolved: 0 },
                        interview: { practiced: false, sessionsCompleted: 0 },
                        aptitude: { practiced: true, testsCompleted: 1 }
                    }
                });
            } else {
                activity.activities.aptitude.practiced = true;
                activity.activities.aptitude.testsCompleted += 1;
            }

            await activity.save();
            console.log('Aptitude practice logged for user:', userId);
        } catch (activityError) {
            // Don't fail the test submission if activity logging fails
            console.error('Error logging practice activity:', activityError);
        }
        //PRACTICE ACTIVITY TRACKING - END

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

router.post('/generate', async (req, res) => {
    try {
        const { category, difficulty, count, companyId, jobDescription, userProfile } = req.body

        if (!category || !difficulty) {
            return res.status(400).json({
                success: false,
                message: 'Category and difficulty are required'
            })
        }

        let allQuestions = []

        // 1. Get company-specific fixed questions (if companyId provided)
        if (companyId) {
            const Company = require('../models/Company')
            const company = await Company.findById(companyId)

            if (company && company.aptitudeQuestions) {
                // filter by category and difficulty
                const fixedQuestions = company.aptitudeQuestions.filter(q =>
                    q.category === category && q.difficulty === difficulty
                )

                // take up to 5 fixed questions
                const selectedFixed = fixedQuestions.slice(0, Math.min(5, fixedQuestions.length))
                allQuestions = [...selectedFixed]

                console.log(`Added ${selectedFixed.length} fixed questions for ${company.name}`)
            }
        }

        // 2. Generate AI questions for remaining count
        const remainingCount = (count || 10) - allQuestions.length

        if (remainingCount > 0) {
            const { generateAptitudeQuestions } = require('../services/aiService')

            // TODO: Later pass jobDescription and userProfile to OpenAI
            const aiQuestions = await generateAptitudeQuestions(
                category,
                difficulty,
                remainingCount
            )

            allQuestions = [...allQuestions, ...aiQuestions]
            console.log(`Added ${aiQuestions.length} AI-generated questions`)
        }

        // 3. Shuffle to mix fixed and AI questions
        const shuffled = allQuestions.sort(() => 0.5 - Math.random())

        res.json({
            success: true,
            count: shuffled.length,
            questions: shuffled,
            breakdown: {
                fixed: allQuestions.length - (remainingCount > 0 ? remainingCount : 0),
                ai: remainingCount > 0 ? remainingCount : 0
            }
        })

    } catch (error) {
        console.error('Error generating questions:', error)
        res.status(500).json({
            success: false,
            message: 'Error generating questions'
        })
    }
})

module.exports = router