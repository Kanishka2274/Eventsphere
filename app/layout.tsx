import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { EventProvider } from '@/app/context/EventContext'
import { Navigation } from '@/components/Navigation'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'EventSphere - Event Management Platform',
  description: 'Discover, create, and manage events with EventSphere',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        <EventProvider>
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-secondary text-secondary-foreground py-8 mt-16">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p>&copy; 2024 EventSphere. All rights reserved.</p>
            </div>
          </footer>
        </EventProvider>
        <Analytics />
      </body>
    </html>
  )
}
