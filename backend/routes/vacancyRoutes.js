const express = require('express');
const router = express.Router();
const Vacancy = require('../models/Vacancy');

// Get all active vacancies
router.get('/vacancies', async (req, res) => {
    try {
        const { status } = req.query;

        const filter = {};
        if (status) filter.status = status;
        else filter.status = 'active';
        filter.deadline = { $gte: new Date() };

        const vacancies = await Vacancy.find(filter)
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({
            success: true,
            vacancies
        });
    } catch (error) {
        console.error('Error fetching vacancies:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vacancies'
        });
    }
});

router.post('/vacancies', async (req, res) => {

    try {

        const newVacancy = new Vacancy(req.body);

        await newVacancy.save();

        res.status(201).json({

            success: true,

            message: 'Vacancy created successfully',

            vacancy: newVacancy

        });

    } catch (error) {

        console.error('Error creating vacancy:', error);

        res.status(500).json({

            success: false,

            message: 'Failed to create vacancy'

        });

    }

});

module.exports = router;