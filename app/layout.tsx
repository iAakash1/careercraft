import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { SimProvider } from '@/components/SimProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Digital Twin — Student Simulation',
  description: 'Simulate your academic future. Configure daily habits and predict performance with fuzzy logic and AI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className="min-h-full antialiased">
          <SimProvider>
            {children}
          </SimProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
