const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

// load env variables
dotenv.config()

// connect to database
connectDB()

const app = express()

// middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// basic test route
app.get('/', (req, res) => {
    res.json({
        message: 'PrepSmart API is running!',
        status: 'success',
        timestamp: new Date().toISOString()
    })
})

// test route to check db connection
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        database: 'connected',
        timestamp: new Date()
    })
})

// import routes
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const interviewRoutes = require('./routes/interviewRoutes')

// use routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/interviews', interviewRoutes)

// error handling middleware
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