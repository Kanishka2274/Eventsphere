'use client'

import Link from 'next/link'
import { useEvent } from '@/app/context/EventContext'
import { Button } from '@/components/ui/button'
import { Calendar, Users, Zap, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function HomePage() {
  const { events } = useEvent()
  const upcomingEvents = events.slice(0, 3)

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-secondary via-secondary/90 to-secondary text-secondary-foreground py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                Discover Amazing Events Near You
              </h1>
              <p className="text-lg text-secondary-foreground/80 mb-8 leading-relaxed">
                EventSphere connects you with incredible events, workshops, and conferences. 
                Find your next experience, connect with like-minded people, and create lasting memories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/events">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-semibold flex items-center gap-2 w-full sm:w-auto justify-center">
                    Explore Events
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button 
                    variant="outline" 
                    className="border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary px-8 py-6 text-base font-semibold w-full sm:w-auto justify-center"
                  >
                    Create Your Event
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-80 md:h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl blur-2xl" />
              <div className="relative h-full bg-gradient-to-br from-primary/30 to-accent/30 rounded-xl flex items-center justify-center border border-secondary-foreground/20">
                <div className="text-center">
                  <Calendar className="w-20 h-20 mx-auto mb-4 text-primary" />
                  <p className="text-xl font-semibold">1000+ Events</p>
                  <p className="text-sm text-secondary-foreground/70">Join our community</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose EventSphere?
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to discover and manage events
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Calendar className="w-8 h-8" />,
                title: 'Easy Discovery',
                description: 'Find events by category, location, date, or search keywords',
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Community',
                description: 'Connect with organizers and attendees from around the world',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Quick Registration',
                description: 'Register for events in seconds and manage all your bookings',
              },
            ].map((feature, idx) => (
              <div key={idx} className="p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 md:py-20 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Upcoming Events
              </h2>
              <p className="text-muted-foreground">
                Check out the latest events happening soon
              </p>
            </div>
            <Link href="/events" className="hidden md:block">
              <Button 
                variant="outline"
                className="border-border text-foreground hover:bg-border/10"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all h-full flex flex-col group cursor-pointer">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                      ${event.price}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 flex flex-col">
                    <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-sm text-muted-foreground flex-1">
                      <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                      <p>📍 {event.location}</p>
                      <p>👥 {event.attendees}/{event.maxAttendees} attending</p>
                    </div>

                    <Button 
                      className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      View Event
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10 md:hidden">
            <Link href="/events">
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6"
              >
                View All Events
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-accent py-16 md:py-20 text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Create Your Event?</h2>
          <p className="text-lg mb-8 opacity-90">
            Become an event organizer and share your passion with thousands of attendees
          </p>
          <Link href="/signup">
            <Button 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 py-6 text-base font-semibold"
            >
              Get Started as Organizer
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
