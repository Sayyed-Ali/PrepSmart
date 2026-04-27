const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

dotenv.config()
connectDB()

const app = express()

app.use(cors({
    origin: "https://prepsmart-frontend.onrender.com",
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.json({
        message: 'PrepSmart API is running!',
        status: 'success',
        timestamp: new Date().toISOString()
    })
})

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        database: 'connected',
        timestamp: new Date()
    })
})

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
const aptitudeRoutes = require('./routes/aptitudeRoutes')
const interviewRoutes = require('./routes/interviewRoutes');
const dsaRoutes = require('./routes/dsaRoutes');
const vacancyRoutes = require('./routes/vacancyRoutes');
const practiceRoutes = require('./routes/practiceRoutes');

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/interviews', interviewRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/aptitude', aptitudeRoutes)
app.use('/api/dsa', dsaRoutes);
app.use('/api', vacancyRoutes);
app.use('/api/practice', practiceRoutes);

app.use((err, req, res, next) => {
    console.error('Error:', err.message)
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
})

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
    console.log(`=================================`)
    console.log(`Server running on port ${PORT}`)
    console.log(`Environment: ${process.env.NODE_ENV}`)
    console.log(`=================================`)
})