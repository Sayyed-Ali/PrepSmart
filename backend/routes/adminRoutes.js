const express = require('express')
const router = express.Router()
const Company = require('../models/Company')
const User = require('../models/User')
const DSAProblem = require('../models/DSAProblem');

// middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        // for now, we'll skip JWT verification and just check if user exists
        // TODO: add proper JWT middleware later
        const { userId } = req.body

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User ID required'
            })
        }

        const user = await User.findById(userId)

        if (!user || user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin only.'
            })
        }

        req.user = user
        next()
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error verifying admin status'
        })
    }
}

// POST /api/admin/companies - add new company
router.post('/companies', async (req, res) => {
    try {
        const companyData = req.body

        // check if company already exists
        const existing = await Company.findOne({ name: companyData.name })
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Company already exists'
            })
        }

        const company = await Company.create(companyData)

        console.log('Company added:', company.name)

        res.status(201).json({
            success: true,
            message: 'Company added successfully',
            company
        })

    } catch (error) {
        console.error('Error adding company:', error)
        res.status(500).json({
            success: false,
            message: 'Error adding company',
            error: error.message
        })
    }
})

// GET /api/admin/companies - get all companies
router.get('/companies', async (req, res) => {
    try {
        const companies = await Company.find().sort({ name: 1 })

        res.json({
            success: true,
            count: companies.length,
            companies
        })

    } catch (error) {
        console.error('Error fetching companies:', error)
        res.status(500).json({
            success: false,
            message: 'Error fetching companies'
        })
    }
})

// PUT /api/admin/companies/:id - update company
router.put('/companies/:id', async (req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            })
        }

        res.json({
            success: true,
            message: 'Company updated successfully',
            company
        })

    } catch (error) {
        console.error('Error updating company:', error)
        res.status(500).json({
            success: false,
            message: 'Error updating company'
        })
    }
})

// DELETE /api/admin/companies/:id - delete company
router.delete('/companies/:id', async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id)

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            })
        }

        res.json({
            success: true,
            message: 'Company deleted successfully'
        })

    } catch (error) {
        console.error('Error deleting company:', error)
        res.status(500).json({
            success: false,
            message: 'Error deleting company'
        })
    }
})

// GET /api/admin/users - get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 })

        res.json({
            success: true,
            count: users.length,
            users
        })

    } catch (error) {
        console.error('Error fetching users:', error)
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        })
    }
})

// PUT /api/admin/users/:id/role - update user role
router.put('/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body

        if (!['student', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            })
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password')

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        res.json({
            success: true,
            message: 'User role updated',
            user
        })

    } catch (error) {
        console.error('Error updating user role:', error)
        res.status(500).json({
            success: false,
            message: 'Error updating user role'
        })
    }
})

router.post('/aptitude/questions', async (req, res) => {
    try {
        const AptitudeQuestion = require('../models/AptitudeQuestion')

        const question = await AptitudeQuestion.create(req.body)

        console.log('Aptitude question added:', question._id)

        res.status(201).json({
            success: true,
            message: 'Question added successfully',
            question
        })

    } catch (error) {
        console.error('Error adding question:', error)
        res.status(500).json({
            success: false,
            message: 'Error adding question',
            error: error.message
        })
    }
})

// POST /api/admin/aptitude/questions/bulk - bulk upload
router.post('/aptitude/questions/bulk', async (req, res) => {
    try {
        const AptitudeQuestion = require('../models/AptitudeQuestion')
        const { questions } = req.body

        if (!Array.isArray(questions)) {
            return res.status(400).json({
                success: false,
                message: 'Questions must be an array'
            })
        }

        const inserted = await AptitudeQuestion.insertMany(questions)

        console.log(`${inserted.length} questions added`)

        res.status(201).json({
            success: true,
            message: 'Questions added successfully',
            count: inserted.length
        })

    } catch (error) {
        console.error('Error bulk uploading questions:', error)
        res.status(500).json({
            success: false,
            message: 'Error uploading questions',
            error: error.message
        })
    }
})

// GET /api/admin/aptitude/questions - get all questions
router.get('/aptitude/questions', async (req, res) => {
    try {
        const AptitudeQuestion = require('../models/AptitudeQuestion')

        const { category, difficulty } = req.query

        let filter = {}
        if (category) filter.category = category
        if (difficulty) filter.difficulty = difficulty

        const questions = await AptitudeQuestion.find(filter).sort({ createdAt: -1 })

        res.json({
            success: true,
            count: questions.length,
            questions
        })

    } catch (error) {
        console.error('Error fetching questions:', error)
        res.status(500).json({
            success: false,
            message: 'Error fetching questions'
        })
    }
})

// DELETE /api/admin/aptitude/questions/:id - delete question
router.delete('/aptitude/questions/:id', async (req, res) => {
    try {
        const AptitudeQuestion = require('../models/AptitudeQuestion')

        const question = await AptitudeQuestion.findByIdAndDelete(req.params.id)

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            })
        }

        res.json({
            success: true,
            message: 'Question deleted successfully'
        })

    } catch (error) {
        console.error('Error deleting question:', error)
        res.status(500).json({
            success: false,
            message: 'Error deleting question'
        })
    }
})


// Create DSA Problem (admin only)
router.post('/dsa-problems', async (req, res) => {
    try {
        const problem = await DSAProblem.create(req.body);

        res.status(201).json({
            success: true,
            message: 'DSA problem created successfully',
            problem
        });
    } catch (error) {
        console.error('Error creating DSA problem:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create DSA problem',
            error: error.message
        });
    }
});

// Get all DSA problems for admin
router.get('/dsa-problems', async (req, res) => {
    try {
        const problems = await DSAProblem.find({}).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: problems.length,
            problems
        });
    } catch (error) {
        console.error('Error fetching DSA problems:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch DSA problems'
        });
    }
});

// Delete DSA problem
router.delete('/dsa-problems/:id', async (req, res) => {
    try {
        const problem = await DSAProblem.findByIdAndDelete(req.params.id);

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found'
            });
        }

        res.json({
            success: true,
            message: 'Problem deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting DSA problem:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete problem'
        });
    }
});

module.exports = router