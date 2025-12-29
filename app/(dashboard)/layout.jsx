'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { AuthProvider } from '@/context/AuthContext'
import Sidebar from '../components/Sidebar'
import { Loader2 } from 'lucide-react'

function DashboardContent({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-deep-orange mx-auto mb-4" size={40} />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      {/* Main content - responsive margins */}
      <main className="flex-1 md:ml-64 p-4 md:p-6 lg:p-8 pt-20 md:pt-6">
        {children}
      </main>
    </div>
  )
}

export default function DashboardLayout({ children }) {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  )
}
