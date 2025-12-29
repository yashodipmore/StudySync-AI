import { AuthProvider } from '@/context/AuthContext'

export default function LandingLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
