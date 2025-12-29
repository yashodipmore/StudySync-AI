import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import connectDB from './mongodb'
import User from '@/models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-studysync-2024'

// In-memory storage fallback (when MongoDB not available)
if (!global.inMemoryUsers) {
  global.inMemoryUsers = []
}

// OTP Store (temporary, in-memory for OTP verification)
if (!global.otpStore) {
  global.otpStore = new Map()
}

export async function hashPassword(password) {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword)
}

export function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id || user._id?.toString(),
      email: user.email,
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// OTP Functions (temporary storage - not in DB)
export function storeOTP(email, otp, userData = null) {
  global.otpStore.set(email, {
    otp,
    userData,
    createdAt: Date.now(),
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
  })
  console.log(`OTP stored for ${email}: ${otp}`)
}

export function getStoredOTP(email) {
  const data = global.otpStore.get(email)
  if (!data) return null
  
  // Check if expired
  if (Date.now() > data.expiresAt) {
    global.otpStore.delete(email)
    return null
  }
  
  return data
}

export function clearOTP(email) {
  global.otpStore.delete(email)
}

// Check if MongoDB is available
async function isMongoAvailable() {
  const conn = await connectDB()
  return conn !== null
}

// User Functions with MongoDB + In-Memory Fallback
export async function createUser(userData) {
  const mongoAvailable = await isMongoAvailable()
  
  if (mongoAvailable) {
    const user = await User.create({
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password,
      isVerified: true
    })
    
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      stats: user.stats,
      createdAt: user.createdAt
    }
  }
  
  // Fallback to in-memory
  const user = {
    id: Date.now().toString(),
    name: userData.name,
    email: userData.email.toLowerCase(),
    password: userData.password,
    isVerified: true,
    stats: { notesUploaded: 0, conversations: 0, quizzesTaken: 0, voiceNotes: 0, studyStreak: 0, totalQuestions: 0, correctAnswers: 0 },
    createdAt: new Date()
  }
  global.inMemoryUsers.push(user)
  console.log('✅ User created in-memory:', user.email)
  return user
}

export async function findUserByEmail(email) {
  const mongoAvailable = await isMongoAvailable()
  
  if (mongoAvailable) {
    const user = await User.findOne({ email: email.toLowerCase() })
    
    if (!user) return null
    
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      isVerified: user.isVerified,
      stats: user.stats,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }
  }
  
  // Fallback to in-memory
  const user = global.inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
  return user || null
}

export async function findUserById(id) {
  const mongoAvailable = await isMongoAvailable()
  
  if (mongoAvailable) {
    // Validate MongoDB ObjectId format (24 hex characters)
    if (!id || !/^[a-fA-F0-9]{24}$/.test(id)) {
      console.log('Invalid ObjectId format:', id)
      return null
    }
    
    try {
      const user = await User.findById(id)
      
      if (!user) return null
      
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        stats: user.stats,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    } catch (error) {
      console.log('FindById error:', error.message)
      return null
    }
  }
  
  // Fallback to in-memory
  const user = global.inMemoryUsers.find(u => u.id === id)
  if (!user) return null
  
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
    stats: user.stats,
    createdAt: user.createdAt
  }
}

export async function updateUserStats(userId, statsUpdate) {
  const mongoAvailable = await isMongoAvailable()
  
  if (mongoAvailable) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: statsUpdate },
      { new: true }
    )
    return user
  }
  
  // Fallback - find and update in memory
  const user = global.inMemoryUsers.find(u => u.id === userId)
  if (user && user.stats) {
    Object.keys(statsUpdate).forEach(key => {
      const statKey = key.replace('stats.', '')
      if (user.stats[statKey] !== undefined) {
        user.stats[statKey] += statsUpdate[key]
      }
    })
  }
  return user
}

export async function updateLastLogin(userId) {
  const mongoAvailable = await isMongoAvailable()
  
  if (mongoAvailable) {
    await User.findByIdAndUpdate(userId, { lastLogin: new Date() })
  }
}

export async function updateUserVerification(email) {
  const mongoAvailable = await isMongoAvailable()
  
  if (mongoAvailable) {
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { isVerified: true },
      { new: true }
    )
    return user
  }
  
  // Fallback
  const user = global.inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (user) {
    user.isVerified = true
  }
  return user
}