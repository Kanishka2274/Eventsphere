'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEvent } from '@/app/context/EventContext'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navigation() {
  const router = useRouter()
  const { isLoggedIn, user, logout } = useEvent()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
    router.push('/')
  }

  return (
    <nav className="bg-secondary text-secondary-foreground shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              ES
            </div>
            <span>EventSphere</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/events" className="hover:text-primary transition-colors">
              Events
            </Link>
            {user?.role === 'organizer' && (
              <Link href="/dashboard" className="hover:text-primary transition-colors">
                Dashboard
              </Link>
            )}
            {isLoggedIn && (
              <Link href="/feedback" className="hover:text-primary transition-colors">
                Feedback
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <span className="text-sm">Welcome, {user?.name}</span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 hover:bg-opacity-20 hover:bg-white rounded"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link
              href="/"
              className="block py-2 px-3 hover:bg-secondary-foreground/10 rounded transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/events"
              className="block py-2 px-3 hover:bg-secondary-foreground/10 rounded transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Events
            </Link>
            {user?.role === 'organizer' && (
              <Link
                href="/dashboard"
                className="block py-2 px-3 hover:bg-secondary-foreground/10 rounded transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {isLoggedIn && (
              <Link
                href="/feedback"
                className="block py-2 px-3 hover:bg-secondary-foreground/10 rounded transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Feedback
              </Link>
            )}
            <div className="pt-3 border-t border-secondary-foreground/20 space-y-2">
              {isLoggedIn ? (
                <>
                  <p className="text-sm px-3">Welcome, {user?.name}</p>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-2 px-3 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <button className="w-full py-2 px-3 border border-secondary-foreground rounded hover:bg-secondary-foreground/10 transition-colors">
                      Login
                    </button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)}>
                    <button className="w-full py-2 px-3 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
