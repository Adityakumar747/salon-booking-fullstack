import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { QueryProvider } from '@/components/QueryProvider'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
const salonName = process.env.NEXT_PUBLIC_SALON_NAME || 'Jawed Habib'

export const metadata: Metadata = {
  title: {
    default: `${salonName} – India's Premier Heritage Salon`,
    template: `%s | ${salonName}`,
  },
  description:
    'Discover the legacy of Jawed Habib. Expert hair, beauty, and grooming services delivered by master stylists in a premium ecosystem.',
  keywords: ['Jawed Habib', 'luxury salon', 'hair artistry', 'beauty care', 'India top salon'],
  openGraph: {
    title: `${salonName} – India's Premier Heritage Salon`,
    description: 'Bespoke beauty services — book your appointment at Jawed Habib today.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <WhatsAppButton />
            <Toaster position="top-right" />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
