const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const multer = require('multer');
const path = require('path');
const { extractResumeText } = require('../utils/resumeParser');
const { generateInterviewQuestions, evaluateInterviewAnswer } = require('../services/aiService');
const PracticeActivity = require('../models/PracticeActivity');

// Configure multer for resume upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/resumes/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = /pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
        }
    }
});

// Create new interview
router.post('/create', upload.single('resume'), async (req, res) => {
    try {
        const { company, role, type, jobDescription, userId } = req.body;

        console.log('Creating interview:', { company, role, type, userId });

        // Extract resume text if file uploaded
        let resumeText = '';
        let resumeFileName = '';

        if (req.file) {
            try {
                resumeFileName = req.file.filename;
                resumeText = await extractResumeText(req.file.path);
                console.log('Resume extracted successfully');
            } catch (error) {
                console.error('Resume parsing error:', error);
                // Continue without resume text
                resumeText = '';
            }
        }

        // Generate interview questions
        console.log('Calling generateInterviewQuestions...');
        const generatedQuestions = await generateInterviewQuestions({
            company,
            role,
            type,
            jobDescription: jobDescription || '',
            resumeText: resumeText || ''
        });

        console.log('Generated questions type:', typeof generatedQuestions);
        console.log('Generated questions array?', Array.isArray(generatedQuestions));
        console.log('Generated questions count:', generatedQuestions?.length);

        // ✅ CRITICAL: Verify we have an actual array
        if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
            console.error('Invalid questions format:', generatedQuestions);
            return res.status(500).json({
                success: false,
                message: 'Failed to generate questions'
            });
        }

        // ✅ Map questions to proper subdocument structure
        const questionsArray = generatedQuestions.map((q, index) => ({
            id: q.id || (index + 1),
            question: String(q.question || ''),
            difficulty: String(q.difficulty || 'medium'),
            type: String(q.type || type),
            expectedAnswer: String(q.expectedAnswer || ''),
            userAnswer: '',
            evaluation: null,
            timeTaken: 0
        }));

        console.log('Mapped questions array:', JSON.stringify(questionsArray, null, 2));

        // ✅ Create interview with ARRAY of questions
        const interviewData = {
            user: userId,
            company: String(company),
            role: String(role),
            type: String(type),
            jobDescription: String(jobDescription || ''),
            resumeText: resumeText ? String(resumeText.substring(0, 2000)) : '',
            resumeFileName: String(resumeFileName),
            questions: questionsArray,  // ✅ This MUST be an array
            status: 'in-progress',
            startedAt: new Date()
        };

        console.log('Creating interview with data:', {
            ...interviewData,
            questions: `Array(${questionsArray.length})`,
            resumeText: resumeText ? 'TEXT_TRUNCATED' : ''
        });

        const interview = await Interview.create(interviewData);

        console.log('Interview created successfully:', interview._id);

        res.status(201).json({
            success: true,
            data: {
                interviewId: interview._id,
                company: interview.company,
                role: interview.role,
                type: interview.type,
                questions: interview.questions
            }
        });

    } catch (error) {
        console.error('Error creating interview:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create interview'
        });
    }
});

// Get interview by ID
router.get('/:id', async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        res.json({
            success: true,
            data: interview
        });
    } catch (error) {
        console.error('Error fetching interview:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch interview'
        });
    }
});

// Submit answer for a question
router.put('/:id/answer', async (req, res) => {
    try {
        const { questionId, answer, timeTaken } = req.body;
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        // Find and update the question
        const question = interview.questions.find(q => q.id === questionId);
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        question.userAnswer = answer;
        question.timeTaken = timeTaken || 0;

        await interview.save();

        res.json({
            success: true,
            data: interview
        });
    } catch (error) {
        console.error('Error submitting answer:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit answer'
        });
    }
});

// Submit entire interview for evaluation
router.post('/:id/submit', async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        // Evaluate each answer
        const evaluationPromises = interview.questions.map(async (question) => {
            if (question.userAnswer && question.userAnswer.trim()) {
                const evaluation = await evaluateInterviewAnswer(
                    question.question,
                    question.userAnswer,
                    interview.role,
                    interview.company
                );
                question.evaluation = evaluation;
                return evaluation.score;
            }
            return 0;
        });

        const scores = await Promise.all(evaluationPromises);

        // Calculate overall score
        const totalScore = scores.reduce((sum, score) => sum + score, 0);
        const averageScore = totalScore / scores.length;
        interview.overallScore = Math.round(averageScore * 10);

        // Collect feedback
        const allStrengths = [];
        const allImprovements = [];

        interview.questions.forEach(q => {
            if (q.evaluation) {
                allStrengths.push(...q.evaluation.strengths);
                allImprovements.push(...q.evaluation.improvements);
            }
        });

        interview.feedback = {
            strengths: allStrengths.slice(0, 5),
            improvements: allImprovements.slice(0, 5)
        };

        interview.status = 'completed';
        interview.completedAt = new Date();

        await interview.save();

        // PRACTICE ACTIVITY TRACKING - start
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let activity = await PracticeActivity.findOne({
                user: interview.user,
                date: today
            });

            if (!activity) {
                activity = new PracticeActivity({
                    user: interview.user,
                    date: today,
                    activities: {
                        dsa: { practiced: false, problemsSolved: 0 },
                        interview: { practiced: true, sessionsCompleted: 1 },
                        aptitude: { practiced: false, testsCompleted: 0 }
                    }
                });
            } else {
                activity.activities.interview.practiced = true;
                activity.activities.interview.sessionsCompleted += 1;
            }

            await activity.save();
            console.log('Interview practice logged for user:', interview.user);
        } catch (activityError) {
            // Don't fail the interview submission if activity logging fails
            console.error('Error logging practice activity:', activityError);
        }
        //PRACTICE ACTIVITY TRACKING - END

        res.json({
            success: true,
            data: interview
        });
    } catch (error) {
        console.error('Error submitting interview:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit interview'
        });
    }
});

// Get user's interviews
router.get('/user/:userId', async (req, res) => {
    try {
        const interviews = await Interview.find({ user: req.params.userId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: interviews
        });
    } catch (error) {
        console.error('Error fetching user interviews:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch interviews'
        });
    }
});

module.exports = router;