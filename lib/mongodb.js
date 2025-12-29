import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

// For testing without MongoDB - uses in-memory fallback
let isConnected = false

async function connectDB() {
  if (!MONGODB_URI || MONGODB_URI.includes('YOUR_USERNAME')) {
    console.log('⚠️ MongoDB URI not configured - using in-memory storage for testing')
    return null
  }

  if (isConnected) {
    return mongoose
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
    isConnected = true
    console.log('✅ MongoDB connected successfully')
    return mongoose
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    return null
  }
}

export default connectDB
