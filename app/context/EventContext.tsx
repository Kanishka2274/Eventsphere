'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  attendees: number
  maxAttendees: number
  image: string
  organizer: string
  price: number
  registered: boolean
}

export interface User {
  id: string
  name: string
  email: string
  role: 'attendee' | 'organizer'
  registeredEvents: string[]
}

export interface Feedback {
  id: string
  eventId: string
  userId: string
  rating: number
  comment: string
  date: string
}

interface EventContextType {
  events: Event[]
  user: User | null
  feedback: Feedback[]
  isLoggedIn: boolean
  login: (email: string, password: string) => void
  logout: () => void
  signup: (name: string, email: string, password: string, role: 'attendee' | 'organizer') => void
  registerEvent: (eventId: string) => void
  unregisterEvent: (eventId: string) => void
  addEvent: (event: Omit<Event, 'id' | 'registered'>) => void
  updateEvent: (eventId: string, updates: Partial<Event>) => void
  deleteEvent: (eventId: string) => void
  addFeedback: (eventId: string, rating: number, comment: string) => void
  getEventById: (id: string) => Event | undefined
  getOrganizerEvents: () => Event[]
  searchEvents: (query: string) => Event[]
}

const EventContext = createContext<EventContextType | undefined>(undefined)

const STORAGE_KEY = 'eventsphere_data'

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'React Conference 2024',
    description: 'Join us for the biggest React conference with talks from industry leaders.',
    date: '2024-04-15',
    time: '09:00',
    location: 'San Francisco, CA',
    category: 'Technology',
    attendees: 245,
    maxAttendees: 500,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
    organizer: 'Tech Events Inc',
    price: 99,
    registered: false,
  },
  {
    id: '2',
    title: 'Web Design Workshop',
    description: 'Learn modern web design principles from expert designers.',
    date: '2024-04-20',
    time: '14:00',
    location: 'New York, NY',
    category: 'Design',
    attendees: 120,
    maxAttendees: 200,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    organizer: 'Design Masters',
    price: 79,
    registered: false,
  },
  {
    id: '3',
    title: 'AI & Machine Learning Summit',
    description: 'Explore the latest advancements in AI and machine learning.',
    date: '2024-05-01',
    time: '10:00',
    location: 'Austin, TX',
    category: 'Technology',
    attendees: 380,
    maxAttendees: 600,
    image: 'https://images.unsplash.com/photo-1515921917809-11d82ba27c7d?w=500&h=300&fit=crop',
    organizer: 'Future Tech Labs',
    price: 149,
    registered: false,
  },
  {
    id: '4',
    title: 'StartUp Networking Mixer',
    description: 'Connect with founders, investors, and fellow entrepreneurs.',
    date: '2024-04-25',
    time: '18:00',
    location: 'Boston, MA',
    category: 'Business',
    attendees: 150,
    maxAttendees: 300,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    organizer: 'Startup Hub',
    price: 49,
    registered: false,
  },
  {
    id: '5',
    title: 'Cloud Architecture Workshop',
    description: 'Master modern cloud architecture patterns and best practices.',
    date: '2024-05-10',
    time: '09:00',
    location: 'Seattle, WA',
    category: 'Technology',
    attendees: 95,
    maxAttendees: 150,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
    organizer: 'Cloud Experts',
    price: 89,
    registered: false,
  },
  {
    id: '6',
    title: 'Digital Marketing Masterclass',
    description: 'Learn strategies to grow your business in the digital age.',
    date: '2024-05-15',
    time: '14:00',
    location: 'Los Angeles, CA',
    category: 'Marketing',
    attendees: 210,
    maxAttendees: 400,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    organizer: 'Marketing Academy',
    price: 69,
    registered: false,
  },
]

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [user, setUser] = useState<User | null>(null)
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setEvents(data.events || mockEvents)
        setUser(data.user || null)
        setFeedback(data.feedback || [])
        setIsLoggedIn(!!data.user)
      } catch {
        console.error('Failed to load saved data')
      }
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isLoggedIn || events.length > 0 || feedback.length > 0) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ events, user, feedback })
      )
    }
  }, [events, user, feedback, isLoggedIn])

  const login = (email: string, password: string) => {
    const mockUser: User = {
      id: '1',
      name: email.split('@')[0],
      email,
      role: 'attendee',
      registeredEvents: [],
    }
    setUser(mockUser)
    setIsLoggedIn(true)
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
  }

  const signup = (name: string, email: string, password: string, role: 'attendee' | 'organizer') => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      registeredEvents: [],
    }
    setUser(newUser)
    setIsLoggedIn(true)
  }

  const registerEvent = (eventId: string) => {
    if (!user) return

    setEvents(
      events.map((event) => {
        if (event.id === eventId && event.attendees < event.maxAttendees) {
          return {
            ...event,
            attendees: event.attendees + 1,
            registered: true,
          }
        }
        return event
      })
    )

    setUser({
      ...user,
      registeredEvents: [...user.registeredEvents, eventId],
    })
  }

  const unregisterEvent = (eventId: string) => {
    if (!user) return

    setEvents(
      events.map((event) => {
        if (event.id === eventId && event.registered) {
          return {
            ...event,
            attendees: Math.max(0, event.attendees - 1),
            registered: false,
          }
        }
        return event
      })
    )

    setUser({
      ...user,
      registeredEvents: user.registeredEvents.filter((id) => id !== eventId),
    })
  }

  const addEvent = (event: Omit<Event, 'id' | 'registered'>) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
      registered: false,
    }
    setEvents([...events, newEvent])
  }

  const updateEvent = (eventId: string, updates: Partial<Event>) => {
    setEvents(
      events.map((event) =>
        event.id === eventId ? { ...event, ...updates } : event
      )
    )
  }

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId))
  }

  const addFeedback = (eventId: string, rating: number, comment: string) => {
    if (!user) return

    const newFeedback: Feedback = {
      id: Date.now().toString(),
      eventId,
      userId: user.id,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
    }
    setFeedback([...feedback, newFeedback])
  }

  const getEventById = (id: string) => {
    return events.find((event) => event.id === id)
  }

  const getOrganizerEvents = () => {
    if (!user || user.role !== 'organizer') return []
    return events
  }

  const searchEvents = (query: string) => {
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.category.toLowerCase().includes(query.toLowerCase()) ||
        event.location.toLowerCase().includes(query.toLowerCase())
    )
  }

  return (
    <EventContext.Provider
      value={{
        events,
        user,
        feedback,
        isLoggedIn,
        login,
        logout,
        signup,
        registerEvent,
        unregisterEvent,
        addEvent,
        updateEvent,
        deleteEvent,
        addFeedback,
        getEventById,
        getOrganizerEvents,
        searchEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  )
}

export function useEvent() {
  const context = useContext(EventContext)
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider')
  }
  return context
}
