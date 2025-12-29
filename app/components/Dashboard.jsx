'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { 
  BarChart3, 
  FileText, 
  MessageSquare, 
  Trophy, 
  TrendingUp, 
  Clock, 
  Target,
  Flame,
  BookOpen,
  Brain,
  Mic,
  Calendar,
  ChevronRight,
  Star,
  User,
  Mail,
  Shield
} from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    notesUploaded: 0,
    conversations: 0,
    quizzesTaken: 0,
    voiceNotes: 0,
    studyStreak: 0,
    totalQuestions: 0,
    correctAnswers: 0
  })

  const [recentActivity, setRecentActivity] = useState([])

  // Load stats from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStats = localStorage.getItem('studysync_stats')
      if (savedStats) {
        setStats(JSON.parse(savedStats))
      }

      const savedActivity = localStorage.getItem('studysync_activity')
      if (savedActivity) {
        setRecentActivity(JSON.parse(savedActivity))
      }
    }
  }, [])

  const statCards = [
    { 
      label: 'Notes Uploaded', 
      value: stats.notesUploaded, 
      icon: FileText, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'AI Conversations', 
      value: stats.conversations, 
      icon: MessageSquare, 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      label: 'Quizzes Taken', 
      value: stats.quizzesTaken, 
      icon: Trophy, 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      label: 'Voice Notes', 
      value: stats.voiceNotes, 
      icon: Mic, 
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50'
    },
  ]

  const quickActions = [
    { label: 'Start AI Chat', href: '/chat', icon: MessageSquare, color: 'from-blue-500 to-blue-600' },
    { label: 'Socratic Mode', href: '/socratic', icon: Brain, color: 'from-purple-500 to-purple-600' },
    { label: 'Voice Notes', href: '/voice-notes', icon: Mic, color: 'from-pink-500 to-pink-600' },
    { label: 'Upload Notes', href: '/notes', icon: FileText, color: 'from-green-500 to-green-600' },
    { label: 'Generate Quiz', href: '/quiz', icon: Trophy, color: 'from-orange-500 to-orange-600' },
  ]

  const accuracy = stats.totalQuestions > 0 
    ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) 
    : 0

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-brand-orange/90 to-deep-orange/80 dark:from-dark-orange dark:to-deep-orange rounded-2xl md:rounded-3xl p-5 md:p-8 mb-6 md:mb-8 text-white border-2 border-brand-orange/50 dark:border-dark-orange">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-playfair font-semibold mb-1 md:mb-2">
              Welcome, {user?.name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-white/80 text-sm md:text-base">
              Ready to continue your learning journey?
            </p>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 text-center border-2 border-white/30 flex-1 md:flex-none">
              <div className="flex items-center gap-1.5 md:gap-2 justify-center mb-0.5 md:mb-1">
                <Flame className="text-yellow-200" size={16} />
                <span className="text-lg md:text-2xl font-semibold">{stats.studyStreak}</span>
              </div>
              <span className="text-xs md:text-sm text-white/70">Day Streak</span>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 text-center border-2 border-white/30 flex-1 md:flex-none">
              <div className="flex items-center gap-1.5 md:gap-2 justify-center mb-0.5 md:mb-1">
                <Target className="text-green-200" size={16} />
                <span className="text-lg md:text-2xl font-semibold">{accuracy}%</span>
              </div>
              <span className="text-xs md:text-sm text-white/70">Accuracy</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="bg-white dark:bg-dark-card rounded-2xl md:rounded-3xl border-2 border-border-dark dark:border-dark-border-strong p-4 md:p-6 mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-playfair font-semibold text-gray-800 dark:text-dark-text mb-4 md:mb-5 flex items-center gap-2">
          <User size={18} className="text-brand-orange dark:text-dark-orange" />
          Your Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 md:w-14 h-12 md:h-14 bg-gradient-to-br from-brand-orange/80 to-deep-orange/70 dark:from-dark-orange dark:to-deep-orange rounded-xl md:rounded-2xl flex items-center justify-center border-2 border-brand-orange/30 dark:border-dark-orange/50">
              <span className="text-lg md:text-xl font-semibold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-dark-text text-base md:text-lg">{user?.name || 'User'}</h3>
              <p className="text-gray-500 dark:text-dark-text-muted text-xs md:text-sm">Student</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 md:w-10 h-9 md:h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl md:rounded-2xl flex items-center justify-center border-2 border-blue-200 dark:border-blue-800">
              <Mail size={14} className="text-blue-500 dark:text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 dark:text-dark-text-muted">Email</p>
              <p className="text-gray-700 dark:text-dark-text font-medium text-xs md:text-sm truncate">{user?.email || 'Not available'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 md:w-10 h-9 md:h-10 bg-green-50 dark:bg-green-900/30 rounded-xl md:rounded-2xl flex items-center justify-center border-2 border-green-200 dark:border-green-800">
              <Shield size={14} className="text-green-500 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-dark-text-muted">Status</p>
              <p className="text-green-600 dark:text-green-400 font-medium text-xs md:text-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Verified
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {statCards.map((stat, idx) => (
          <div 
            key={idx} 
            className="bg-white dark:bg-dark-card rounded-2xl md:rounded-3xl p-4 md:p-5 border-2 border-border-dark dark:border-dark-border-strong"
          >
            <div className="w-8 md:w-9 h-8 md:h-9 bg-soft-orange dark:bg-dark-orange/20 rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-3 border-2 border-peach dark:border-dark-orange/40">
              <stat.icon size={16} className="text-brand-orange dark:text-dark-orange" />
            </div>
            <p className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-dark-text">{stat.value}</p>
            <p className="text-xs md:text-sm text-gray-500 dark:text-dark-text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-dark-card rounded-2xl md:rounded-3xl border-2 border-border-dark dark:border-dark-border-strong p-4 md:p-6 mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-playfair font-semibold text-gray-800 dark:text-dark-text mb-4 md:mb-5">Quick Actions</h2>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
          {quickActions.map((action, idx) => (
            <Link
              key={idx}
              href={action.href}
              className="group p-3 md:p-4 bg-light-orange dark:bg-dark-card-hover hover:bg-soft-orange dark:hover:bg-dark-border rounded-xl md:rounded-2xl border-2 border-border-dark dark:border-dark-border hover:border-brand-orange dark:hover:border-dark-orange transition-all text-center active:scale-95"
            >
              <div className="w-9 md:w-11 h-9 md:h-11 bg-soft-orange dark:bg-dark-orange/20 rounded-lg md:rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3 group-hover:scale-105 transition-transform border-2 border-peach dark:border-dark-orange/40">
                <action.icon size={18} className="text-brand-orange dark:text-dark-orange" />
              </div>
              <p className="text-xs md:text-sm font-medium text-gray-700 dark:text-dark-text truncate">{action.label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-dark-card rounded-2xl md:rounded-3xl border-2 border-border-dark dark:border-dark-border-strong p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <h2 className="text-lg md:text-xl font-playfair font-semibold text-gray-800 dark:text-dark-text flex items-center gap-2">
            <Clock size={16} className="text-brand-orange dark:text-dark-orange" />
            Recent Activity
          </h2>
        </div>
        
        {recentActivity.length > 0 ? (
          <div className="space-y-2 md:space-y-3">
            {recentActivity.slice(0, 5).map((activity, idx) => (
              <div key={idx} className="flex items-center gap-3 md:gap-4 p-2.5 md:p-3 bg-light-orange dark:bg-dark-card-hover rounded-xl md:rounded-2xl border-2 border-border-dark dark:border-dark-border">
                <div className="w-9 md:w-10 h-9 md:h-10 bg-soft-orange dark:bg-dark-orange/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-peach dark:border-dark-orange/40">
                  {activity.type === 'chat' && <MessageSquare size={14} className="text-brand-orange dark:text-dark-orange" />}
                  {activity.type === 'quiz' && <Trophy size={14} className="text-brand-orange dark:text-dark-orange" />}
                  {activity.type === 'notes' && <FileText size={14} className="text-brand-orange dark:text-dark-orange" />}
                  {activity.type === 'voice' && <Mic size={14} className="text-brand-orange dark:text-dark-orange" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-gray-700 dark:text-dark-text truncate">{activity.title}</p>
                  <p className="text-xs text-gray-500 dark:text-dark-text-muted">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 md:py-12">
            <div className="w-12 md:w-14 h-12 md:h-14 bg-soft-orange dark:bg-dark-orange/20 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 border-2 border-peach dark:border-dark-orange/40">
              <BookOpen size={20} className="text-brand-orange dark:text-dark-orange" />
            </div>
            <h3 className="text-gray-800 dark:text-dark-text font-medium mb-1 md:mb-2 text-sm md:text-base">No activity yet</h3>
            <p className="text-gray-500 dark:text-dark-text-muted text-xs md:text-sm mb-4 md:mb-5">Start learning to see your activity here</p>
            <Link 
              href="/chat"
              className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-gradient-to-r from-brand-orange to-deep-orange text-white rounded-xl md:rounded-2xl text-xs md:text-sm font-medium hover:shadow-md transition-all active:scale-95"
            >
              Start Learning
              <ChevronRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
