const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...')

        const conn = await mongoose.connect(process.env.MONGO_URI)

        console.log(`MongoDB Connected: ${conn.connection.host}`)
        console.log(`Database Name: ${conn.connection.name}`)

    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message)
        // exit process with failure
        process.exit(1)
    }
}

module.exports = connectDB