import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import { ServiceHoursProvider } from '@/lib/ServiceHoursContext'
import { AuthProvider } from '@/lib/AuthContext'
import { ProfileProvider } from '@/lib/ProfileContext'

export const metadata: Metadata = {
  title: 'QuickServe | Service Hour Tracking',
  description: 'Quickly track and manage your community service hours with ease',
  keywords: ['Service Hours', 'Volunteer', 'Community Service', 'Time Tracking', 'QuickServe'],
  authors: [{ name: 'QuickServe' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-white antialiased">
        <AuthProvider>
          <ProfileProvider>
            <ServiceHoursProvider>
              <Navigation />
              <main>
                {children}
              </main>
            </ServiceHoursProvider>
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 