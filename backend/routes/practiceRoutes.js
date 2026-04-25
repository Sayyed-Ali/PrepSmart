const express = require('express');
const router = express.Router();
const PracticeActivity = require('../models/PracticeActivity');

// Log practice activity (called automatically when user completes DSA/Interview/Aptitude)
router.post('/log', async (req, res) => {
    try {
        const { userId, type, count = 1 } = req.body; // type: 'dsa', 'interview', 'aptitude'

        if (!userId || !type) {
            return res.status(400).json({
                success: false,
                message: 'User ID and type are required'
            });
        }

        // Get today's date at midnight (for consistent day grouping)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find or create today's activity record
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
                    aptitude: { practiced: false, testsCompleted: 0 }
                }
            });
        }

        // Update the appropriate activity type
        if (type === 'dsa') {
            activity.activities.dsa.practiced = true;
            activity.activities.dsa.problemsSolved += count;
        } else if (type === 'interview') {
            activity.activities.interview.practiced = true;
            activity.activities.interview.sessionsCompleted += count;
        } else if (type === 'aptitude') {
            activity.activities.aptitude.practiced = true;
            activity.activities.aptitude.testsCompleted += count;
        }

        await activity.save();

        res.json({
            success: true,
            message: 'Practice activity logged',
            activity
        });
    } catch (error) {
        console.error('Error logging practice activity:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to log activity'
        });
    }
});

// Get user's practice calendar (last 90 days)
router.get('/calendar/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { days = 90 } = req.query;

        // Get date range
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));
        startDate.setHours(0, 0, 0, 0);

        const activities = await PracticeActivity.find({
            user: userId,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });

        res.json({
            success: true,
            activities
        });
    } catch (error) {
        console.error('Error fetching calendar:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch calendar'
        });
    }
});

// Get user's practice streaks and stats
router.get('/stats/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Get all practice activities sorted by date
        const activities = await PracticeActivity.find({
            user: userId
        }).sort({ date: -1 });

        // Calculate current streak
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        let totalDays = 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if practiced today or yesterday (for current streak)
        let checkDate = new Date(today);
        let streakBroken = false;

        for (const activity of activities) {
            const activityDate = new Date(activity.date);
            activityDate.setHours(0, 0, 0, 0);

            if (activity.hasPractice()) {
                totalDays++;

                // For current streak calculation
                if (!streakBroken) {
                    const daysDiff = Math.floor((checkDate - activityDate) / (1000 * 60 * 60 * 24));

                    if (daysDiff === 0 || daysDiff === 1) {
                        currentStreak++;
                        checkDate = new Date(activityDate);
                        checkDate.setDate(checkDate.getDate() - 1);
                    } else {
                        streakBroken = true;
                    }
                }

                // For longest streak
                tempStreak++;
                if (tempStreak > longestStreak) {
                    longestStreak = tempStreak;
                }
            } else {
                tempStreak = 0;
            }
        }

        // Calculate totals by type
        const totals = {
            dsa: 0,
            interview: 0,
            aptitude: 0
        };

        activities.forEach(activity => {
            totals.dsa += activity.activities.dsa.problemsSolved;
            totals.interview += activity.activities.interview.sessionsCompleted;
            totals.aptitude += activity.activities.aptitude.testsCompleted;
        });

        res.json({
            success: true,
            stats: {
                currentStreak,
                longestStreak,
                totalDaysPracticed: totalDays,
                totals
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stats'
        });
    }
});

module.exports = router;