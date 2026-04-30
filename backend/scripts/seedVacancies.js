const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const Vacancy = require('../models/Vacancy');

const MONGO_URI = process.env.MONGO_URI;

const sampleVacancies = [
    {
        company: 'Amazon',
        role: 'SDE 1',
        location: 'Bangalore',
        type: 'Full-time',
        experience: '0-2 years',
        salary: '₹15-20 LPA',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        description: 'Software Development Engineer position',
        skills: ['Java', 'Python', 'AWS'],
        applyLink: 'https://amazon.jobs',
        status: 'active'
    },
    {
        company: 'Google',
        role: 'Software Engineering Intern',
        location: 'Hyderabad',
        type: 'Internship',
        experience: '0 years',
        salary: '₹50,000/month',
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        description: 'Internship position',
        skills: ['Python', 'C++', 'Algorithms'],
        applyLink: 'https://careers.google.com',
        status: 'active'
    },
    {
        company: 'Microsoft',
        role: 'Software Engineer',
        location: 'Noida',
        type: 'Full-time',
        experience: '0-3 years',
        salary: '₹18-25 LPA',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        description: 'Software Engineer role',
        skills: ['C#', '.NET', 'Azure'],
        applyLink: 'https://careers.microsoft.com',
        status: 'active'
    }
];

async function seedVacancies() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(' Connected to MongoDB');

        await Vacancy.deleteMany({});
        await Vacancy.insertMany(sampleVacancies);

        console.log(' Seeded 3 job vacancies');
        await mongoose.connection.close();
    } catch (error) {
        console.error(' Error:', error);
        process.exit(1);
    }
}

seedVacancies();