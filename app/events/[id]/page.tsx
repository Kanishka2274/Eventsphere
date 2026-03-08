'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEvent } from '@/app/context/EventContext'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, MapPin, Calendar, Clock, Users, DollarSign } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function EventDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { getEventById, registerEvent, unregisterEvent, isLoggedIn, user } = useEvent()
  const eventId = params.id as string
  const event = getEventById(eventId)
  const [isRegistered, setIsRegistered] = useState(event?.registered || false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  if (!event) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Event Not Found</h1>
          <p className="text-muted-foreground mb-4">This event doesn't exist or has been removed.</p>
          <Link href="/events">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleRegister = () => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    if (event.attendees >= event.maxAttendees) {
      alert('This event is fully booked!')
      return
    }

    registerEvent(eventId)
    setIsRegistered(true)
    setShowConfirmation(true)
    setTimeout(() => setShowConfirmation(false), 3000)
  }

  const handleUnregister = () => {
    unregisterEvent(eventId)
    setIsRegistered(false)
  }

  const availableSpots = event.maxAttendees - event.attendees
  const capacityPercentage = (event.attendees / event.maxAttendees) * 100

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">
      {/* Success Confirmation */}
      {showConfirmation && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-green-500/90 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>Successfully registered for this event!</span>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/events" className="text-primary hover:underline mb-6 inline-block">
          ← Back to Events
        </Link>

        {/* Event Image */}
        <div className="relative h-96 rounded-xl overflow-hidden mb-8 bg-muted border border-border">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold">
            {event.category}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title and Price */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-foreground mb-4">{event.title}</h1>
              <p className="text-xl text-primary font-semibold">${event.price}</p>
            </div>

            {/* Event Info Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-8 bg-card border border-border rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold text-foreground">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-semibold text-foreground">{event.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold text-foreground">{event.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Attendees</p>
                  <p className="font-semibold text-foreground">
                    {event.attendees} / {event.maxAttendees}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">About This Event</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {event.description}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Join us for an unforgettable experience! Whether you're a beginner or an expert,
                this event will provide valuable insights, networking opportunities, and hands-on
                learning. Connect with like-minded professionals and expand your horizons.
              </p>
            </div>

            {/* Organizer Info */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">About the Organizer</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  {event.organizer.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{event.organizer}</p>
                  <p className="text-sm text-muted-foreground">Event Organizer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Registration Card */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              {/* Availability */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-foreground">Availability</span>
                  <span className={`text-sm font-semibold ${availableSpots > 0 ? 'text-green-500' : 'text-destructive'}`}>
                    {availableSpots > 0 ? `${availableSpots} spots left` : 'Fully Booked'}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all duration-300"
                    style={{ width: `${capacityPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {event.attendees} of {event.maxAttendees} attending
                </p>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-border">
                <p className="text-sm text-muted-foreground mb-2">Total Price</p>
                <p className="text-3xl font-bold text-foreground">${event.price}</p>
              </div>

              {/* Registration Button */}
              {isRegistered ? (
                <>
                  <Button
                    className="w-full bg-green-600/20 text-green-600 hover:bg-green-600/30 border border-green-600/30 mb-3"
                    disabled
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Registered
                  </Button>
                  <Button
                    onClick={handleUnregister}
                    variant="outline"
                    className="w-full border-destructive text-destructive hover:bg-destructive/10"
                  >
                    Cancel Registration
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleRegister}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-base font-semibold mb-3"
                  disabled={availableSpots === 0}
                >
                  {availableSpots === 0 ? 'Event Fully Booked' : 'Register Now'}
                </Button>
              )}

              {!isLoggedIn && !isRegistered && (
                <p className="text-xs text-muted-foreground text-center">
                  <Link href="/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                  {' '}to register for this event
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
