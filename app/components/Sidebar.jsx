'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { 
  MessageSquare, 
  BrainCircuit, 
  Mic, 
  FileText, 
  ClipboardList,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LogOut,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react'

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsCollapsed(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const tabs = [
    { 
      id: 'dashboard',
      href: '/dashboard', 
      icon: BarChart3, 
      label: 'Dashboard',
      description: 'Track your progress'
    },
    { 
      id: 'chat',
      href: '/chat', 
      icon: MessageSquare, 
      label: 'AI Chat',
      description: 'Ask anything'
    },
    { 
      id: 'socratic',
      href: '/socratic', 
      icon: BrainCircuit, 
      label: 'Socratic Mode',
      description: 'Learn through questions',
      badge: 'NEW'
    },
    { 
      id: 'voice',
      href: '/voice-notes', 
      icon: Mic, 
      label: 'Voice Notes',
      description: 'Speak your thoughts'
    },
    { 
      id: 'notes',
      href: '/notes', 
      icon: FileText, 
      label: 'Upload Notes',
      description: 'Get AI summaries'
    },
    { 
      id: 'quiz',
      href: '/quiz', 
      icon: ClipboardList, 
      label: 'Quiz Generator',
      description: 'Test your knowledge'
    },
  ]

  const isActive = (href) => pathname === href

  // Mobile Header Bar
  const MobileHeader = () => (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-dark-card border-b-2 border-border-dark dark:border-dark-border-strong px-4 py-3 flex items-center justify-between safe-area-top">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="w-9 h-9 bg-soft-orange dark:bg-dark-orange/20 rounded-xl flex items-center justify-center border-2 border-peach dark:border-dark-orange/50">
          <GraduationCap size={18} className="text-brand-orange dark:text-dark-orange" />
        </div>
        <span className="text-lg font-playfair font-semibold text-gray-800 dark:text-dark-text">StudySync</span>
      </Link>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-light-orange dark:bg-dark-card-hover border-2 border-border-dark dark:border-dark-border-strong active:scale-95 transition-transform"
        >
          {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-700" />}
        </button>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-xl bg-light-orange dark:bg-dark-card-hover border-2 border-border-dark dark:border-dark-border-strong active:scale-95 transition-transform"
        >
          {isMobileOpen ? <X size={20} className="text-gray-700 dark:text-dark-text" /> : <Menu size={20} className="text-gray-700 dark:text-dark-text" />}
        </button>
      </div>
    </div>
  )

  // Mobile Overlay
  const MobileOverlay = () => (
    <div 
      className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={() => setIsMobileOpen(false)}
    />
  )

  // Sidebar Content
  const SidebarContent = () => (
    <>
      {/* Logo - Desktop Only */}
      <div className={`hidden md:block p-5 border-b-2 border-border-dark dark:border-dark-border-strong ${isCollapsed ? 'px-3' : ''}`}>
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-soft-orange dark:bg-dark-orange/20 rounded-2xl flex items-center justify-center flex-shrink-0 border-2 border-peach dark:border-dark-orange/50">
            <GraduationCap size={20} className="text-brand-orange dark:text-dark-orange" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-playfair font-semibold text-gray-800 dark:text-dark-text">StudySync AI</h1>
              <p className="text-xs text-gray-500 dark:text-dark-text-muted">Learn smarter</p>
            </div>
          )}
        </Link>
      </div>

      {/* Mobile Logo */}
      <div className="md:hidden p-4 border-b-2 border-border-dark dark:border-dark-border-strong">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-soft-orange dark:bg-dark-orange/20 rounded-2xl flex items-center justify-center border-2 border-peach dark:border-dark-orange/50">
            <GraduationCap size={20} className="text-brand-orange dark:text-dark-orange" />
          </div>
          <div>
            <h1 className="text-lg font-playfair font-semibold text-gray-800 dark:text-dark-text">StudySync AI</h1>
            <p className="text-xs text-gray-500 dark:text-dark-text-muted">Learn smarter</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 ${isCollapsed ? 'p-2' : 'p-3'} space-y-1 overflow-y-auto`}>
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={`w-full flex items-center ${isCollapsed && !isMobile ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'} rounded-xl transition-all duration-200 group relative active:scale-[0.98] ${
              isActive(tab.href)
                ? 'bg-soft-orange dark:bg-dark-orange/20 text-gray-800 dark:text-dark-text border-2 border-brand-orange dark:border-dark-orange'
                : 'text-gray-600 dark:text-dark-text-muted hover:bg-light-orange dark:hover:bg-dark-card-hover border-2 border-transparent hover:border-border-dark dark:hover:border-dark-border'
            }`}
            title={isCollapsed ? tab.label : undefined}
          >
            <tab.icon 
              size={18} 
              className={`flex-shrink-0 ${isActive(tab.href) ? 'text-brand-orange dark:text-dark-orange' : 'text-gray-400 dark:text-dark-text-muted group-hover:text-brand-orange dark:group-hover:text-dark-orange'} transition-colors`}
            />
            {(!isCollapsed || isMobile) && (
              <>
                <div className="flex-1 text-left min-w-0">
                  <span className="font-medium block text-sm truncate">{tab.label}</span>
                  <span className={`text-xs truncate block ${isActive(tab.href) ? 'text-gray-600 dark:text-dark-text-muted' : 'text-gray-400 dark:text-dark-text-muted'}`}>
                    {tab.description}
                  </span>
                </div>
                {tab.badge && (
                  <span className="px-1.5 py-0.5 text-xs font-medium rounded-md bg-brand-orange text-white">
                    {tab.badge}
                  </span>
                )}
              </>
            )}
            
            {/* Tooltip for collapsed state - Desktop only */}
            {isCollapsed && !isMobile && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 dark:bg-dark-card text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-dark-border">
                {tab.label}
              </div>
            )}
          </Link>
        ))}
      </nav>

      {/* User Section */}
      <div className={`border-t-2 border-border-dark dark:border-dark-border-strong ${isCollapsed && !isMobile ? 'p-2' : 'p-3'}`}>
        {(!isCollapsed || isMobile) ? (
          <div className="space-y-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-dark-text-muted hover:bg-light-orange dark:hover:bg-dark-card-hover rounded-xl transition-colors border-2 border-transparent hover:border-border-dark dark:hover:border-dark-border active:scale-[0.98]"
            >
              {isDark ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} />}
              <span className="text-sm font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            
            {/* User Info */}
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-9 h-9 bg-soft-orange dark:bg-dark-orange/20 rounded-xl flex items-center justify-center border-2 border-peach dark:border-dark-orange/50 flex-shrink-0">
                <span className="text-brand-orange dark:text-dark-orange font-medium text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-dark-text truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 dark:text-dark-text-muted truncate">{user?.email || ''}</p>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-500 dark:text-dark-text-muted hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 rounded-xl transition-colors border-2 border-transparent hover:border-red-200 dark:hover:border-red-800 active:scale-[0.98]"
            >
              <LogOut size={16} />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={toggleTheme}
              className="w-full flex justify-center p-3 text-gray-400 dark:text-dark-text-muted hover:bg-light-orange dark:hover:bg-dark-card-hover rounded-xl transition-colors group relative"
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 dark:bg-dark-card text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-dark-border">
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </div>
            </button>
            <button
              onClick={logout}
              className="w-full flex justify-center p-3 text-gray-400 dark:text-dark-text-muted hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 rounded-xl transition-colors group relative"
              title="Sign Out"
            >
              <LogOut size={18} />
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 dark:bg-dark-card text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-dark-border">
                Sign Out
              </div>
            </button>
          </div>
        )}
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Mobile Overlay */}
      <MobileOverlay />

      {/* Desktop Sidebar */}
      <div 
        className={`hidden md:flex ${
          isCollapsed ? 'w-[70px]' : 'w-64'
        } min-h-screen bg-white dark:bg-dark-card border-r-2 border-border-dark dark:border-dark-border-strong flex-col transition-all duration-300 ease-in-out fixed left-0 top-0 z-40`}
      >
        {/* Collapse Toggle Button - Desktop Only */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-7 w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center shadow-md hover:bg-deep-orange transition-colors z-10 border-2 border-white dark:border-dark-bg"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
        
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div 
        className={`md:hidden fixed top-0 left-0 h-full w-[280px] bg-white dark:bg-dark-card border-r-2 border-border-dark dark:border-dark-border-strong flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </div>
    </>
  )
}
