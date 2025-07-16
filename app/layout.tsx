import type { Metadata } from 'next'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'
import { ServiceHoursProvider } from '@/lib/ServiceHoursContext'
import { AuthProvider } from '@/lib/AuthContext'
import { ProfileProvider } from '@/lib/ProfileContext'
import { LoadingProvider } from '@/lib/LoadingContext'

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
      <body className="min-h-screen bg-canvas-50 antialiased">
        <LoadingProvider>
          <AuthProvider>
            <ProfileProvider>
              <ServiceHoursProvider>
                <ClientLayout>
                  {children}
                </ClientLayout>
              </ServiceHoursProvider>
            </ProfileProvider>
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  )
} 