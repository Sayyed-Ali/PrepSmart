const express = require('express')
const router = express.Router()
const User = require('../models/User')

// GET /api/users/:id - get user profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                stats: user.stats,
                createdAt: user.createdAt
            }
        })

    } catch (error) {
        console.error('Error fetching user:', error)
        res.status(500).json({
            success: false,
            message: 'Error fetching user data'
        })
    }
})

// PUT /api/users/:id - update user profile
router.put('/:id', async (req, res) => {
    try {
        const { name, email } = req.body

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email },
            { new: true, runValidators: true }
        )

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user
        })

    } catch (error) {
        console.error('Error updating user:', error)
        res.status(500).json({
            success: false,
            message: 'Error updating profile'
        })
    }
})

module.exports = router