import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'
import AuthSessionProvider from '@/context/SessionProvider'

export const metadata = {
  title: 'StudySync AI - The AI That Teaches, Not Just Tells',
  description: 'Your intelligent study companion that guides you to learn through Socratic questioning, voice notes, and smart summarization.',
  keywords: ['AI', 'study', 'education', 'Socratic', 'learning', 'notes', 'quiz'],
  authors: [{ name: 'StudySync AI Team' }],
  openGraph: {
    title: 'StudySync AI - The AI That Teaches',
    description: 'Learn smarter, not harder with AI-powered study tools',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased font-poppins bg-cream dark:bg-dark-bg transition-colors duration-300">
        <AuthSessionProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
