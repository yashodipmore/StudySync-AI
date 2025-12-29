import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  stats: {
    notesUploaded: { type: Number, default: 0 },
    conversations: { type: Number, default: 0 },
    quizzesTaken: { type: Number, default: 0 },
    voiceNotes: { type: Number, default: 0 },
    studyStreak: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
})

// Prevent model recompilation error in Next.js
const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User
