'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useEvent } from '@/app/context/EventContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Edit2, Trash2, AlertCircle, Calendar, MapPin, Users } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoggedIn, addEvent, deleteEvent, updateEvent, events } = useEvent()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Technology',
    maxAttendees: 100,
    price: 99,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
  })

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'organizer') {
      router.push('/login')
    }
  }, [isLoggedIn, user?.role, router])

  const organizerEvents = events

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'maxAttendees' || name === 'price' ? parseInt(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.date || !formData.location) {
      alert('Please fill in all required fields')
      return
    }

    if (editingId) {
      updateEvent(editingId, formData)
      setEditingId(null)
    } else {
      addEvent({
        ...formData,
        attendees: 0,
        organizer: user?.name || 'Unknown',
      })
    }

    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: 'Technology',
      maxAttendees: 100,
      price: 99,
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
    })
    setShowForm(false)
  }

  const handleEdit = (eventId: string) => {
    const event = events.find((e) => e.id === eventId)
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        category: event.category,
        maxAttendees: event.maxAttendees,
        price: event.price,
        image: event.image,
      })
      setEditingId(eventId)
      setShowForm(true)
    }
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Event Dashboard</h1>
            <p className="text-muted-foreground">Manage and create your events</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Cancel' : 'Create Event'}
          </Button>
        </div>

        {/* Create/Edit Event Form */}
        {showForm && (
          <div className="bg-card border border-border rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {editingId ? 'Edit Event' : 'Create New Event'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Event Title *
                  </label>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., React Conference 2024"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Date *
                  </label>
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Time
                  </label>
                  <Input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Location *
                  </label>
                  <Input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., San Francisco, CA"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Ticket Price ($)
                  </label>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Max Attendees
                  </label>
                  <Input
                    type="number"
                    name="maxAttendees"
                    value={formData.maxAttendees}
                    onChange={handleInputChange}
                    min="1"
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Image URL
                  </label>
                  <Input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="bg-input border-border text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your event..."
                  rows={4}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {editingId ? 'Update Event' : 'Create Event'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                  variant="outline"
                  className="border-border text-foreground hover:bg-border/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Events List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground mb-4">Your Events</h2>

          {organizerEvents.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">No events yet. Create your first event!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {organizerEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:shadow-lg transition-shadow"
                >
                  {/* Event Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-foreground mb-3">{event.title}</h3>

                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {event.attendees}/{event.maxAttendees}
                      </div>
                    </div>

                    {/* Capacity Bar */}
                    <div className="mt-3 w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${(event.attendees / event.maxAttendees) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 w-full md:w-auto">
                    <Link href={`/events/${event.id}`} className="flex-1 md:flex-none">
                      <Button
                        variant="outline"
                        className="w-full border-border text-foreground hover:bg-border/10"
                      >
                        View
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleEdit(event.id)}
                      variant="outline"
                      className="border-border text-foreground hover:bg-border/10 px-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this event?')) {
                          deleteEvent(event.id)
                        }
                      }}
                      variant="outline"
                      className="border-destructive text-destructive hover:bg-destructive/10 px-3"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
