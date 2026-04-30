const express = require('express');
const router = express.Router();
const DSAProblem = require('../models/DSAProblem');
const UserDSAProgress = require('../models/UserDSAProgress');
const PracticeActivity = require('../models/PracticeActivity');

// Get all DSA problems (with user progress if authenticated)
router.get('/problems', async (req, res) => {
    try {
        const { company, category, difficulty } = req.query;

        // Build filter
        const filter = {};
        if (company) filter.company = company;
        if (category) filter.category = category;
        if (difficulty) filter.difficulty = difficulty;

        const problems = await DSAProblem.find(filter).sort({ category: 1, difficulty: 1 });

        //  Get user ID from query or body (since no auth middleware)
        const userId = req.query.userId || req.body.userId;

        // If user ID provided, get their progress
        let userProgress = {};
        if (userId) {
            const progress = await UserDSAProgress.find({ user: userId });
            progress.forEach(p => {
                userProgress[p.problem.toString()] = {
                    isCompleted: p.isCompleted,
                    isFavorite: p.isFavorite
                };
            });
        }

        // Merge problems with user progress
        const problemsWithProgress = problems.map(problem => ({
            ...problem.toObject(),
            isCompleted: userProgress[problem._id.toString()]?.isCompleted || false,
            isFavorite: userProgress[problem._id.toString()]?.isFavorite || false
        }));

        res.json({
            success: true,
            problems: problemsWithProgress
        });
    } catch (error) {
        console.error('Error fetching DSA problems:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch problems'
        });
    }
});

// Get single problem by ID
router.get('/problems/:id', async (req, res) => {
    try {
        const problem = await DSAProblem.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found'
            });
        }

        // Get user progress if userId provided
        const userId = req.query.userId;
        let userProgress = null;
        if (userId) {
            userProgress = await UserDSAProgress.findOne({
                user: userId,
                problem: req.params.id
            });
        }

        res.json({
            success: true,
            problem: {
                ...problem.toObject(),
                isCompleted: userProgress?.isCompleted || false,
                isFavorite: userProgress?.isFavorite || false
            }
        });
    } catch (error) {
        console.error('Error fetching problem:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch problem'
        });
    }
});

// Update the toggle-complete route to log practice:
router.post('/problems/:id/toggle-complete', async (req, res) => {
    try {
        const userId = req.body.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID required'
            });
        }

        let progress = await UserDSAProgress.findOne({
            user: userId,
            problem: req.params.id
        });

        if (progress) {
            progress.isCompleted = !progress.isCompleted;
            progress.completedAt = progress.isCompleted ? new Date() : null;
            await progress.save();
        } else {
            progress = await UserDSAProgress.create({
                user: userId,
                problem: req.params.id,
                isCompleted: true,
                completedAt: new Date()
            });
        }

        //  AUTO-LOG PRACTICE ACTIVITY (NEW CODE)
        if (progress.isCompleted) {
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
                        dsa: { practiced: true, problemsSolved: 1 },
                        interview: { practiced: false, sessionsCompleted: 0 },
                        aptitude: { practiced: false, testsCompleted: 0 }
                    }
                });
            } else {
                activity.activities.dsa.practiced = true;
                activity.activities.dsa.problemsSolved += 1;
            }

            await activity.save();
        }

        res.json({
            success: true,
            isCompleted: progress.isCompleted
        });
    } catch (error) {
        console.error('Error toggling completion:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update progress'
        });
    }
});

// Toggle favorite status
router.post('/problems/:id/toggle-favorite', async (req, res) => {
    try {
        const userId = req.body.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID required'
            });
        }

        let progress = await UserDSAProgress.findOne({
            user: userId,
            problem: req.params.id
        });

        if (progress) {
            progress.isFavorite = !progress.isFavorite;
            await progress.save();
        } else {
            progress = await UserDSAProgress.create({
                user: userId,
                problem: req.params.id,
                isFavorite: true
            });
        }

        res.json({
            success: true,
            isFavorite: progress.isFavorite
        });
    } catch (error) {
        console.error('Error toggling favorite:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update favorite'
        });
    }
});

// Get user's DSA statistics
router.get('/stats', async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.json({
                success: true,
                stats: {
                    totalSolved: 0,
                    totalFavorites: 0,
                    byDifficulty: { easy: 0, medium: 0, hard: 0 },
                    byCategory: {}
                }
            });
        }

        const progress = await UserDSAProgress.find({ user: userId })
            .populate('problem');

        const stats = {
            totalSolved: progress.filter(p => p.isCompleted).length,
            totalFavorites: progress.filter(p => p.isFavorite).length,
            byDifficulty: {
                easy: 0,
                medium: 0,
                hard: 0
            },
            byCategory: {}
        };

        progress.forEach(p => {
            if (p.isCompleted && p.problem) {
                const difficulty = p.problem.difficulty.toLowerCase();
                stats.byDifficulty[difficulty]++;

                const category = p.problem.category;
                stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
            }
        });

        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics'
        });
    }
});

module.exports = router;