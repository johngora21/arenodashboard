import type { Metadata } from 'next'
import './globals.css'
import { Poppins } from 'next/font/google'
import { AuthProvider } from '@/components/AuthProvider'
import InactivityWarning from '@/components/InactivityWarning'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Areno Logistics - Admin Dashboard',
  description: 'Admin dashboard for managing logistics quotes and services',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins antialiased`}>
        <AuthProvider>
        {children}
          <InactivityWarning />
        </AuthProvider>
      </body>
    </html>
  )
} 