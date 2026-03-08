'use client'

import { useEvent } from '@/app/context/EventContext'
import { TrendingUp, Users, Calendar, DollarSign, Award } from 'lucide-react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function AnalyticsPage() {
  const { events, feedback } = useEvent()

  // Prepare data for charts
  const eventsByCategory = events.reduce(
    (acc, event) => {
      const existing = acc.find((item) => item.name === event.category)
      if (existing) {
        existing.value += 1
        existing.attendees += event.attendees
      } else {
        acc.push({ name: event.category, value: 1, attendees: event.attendees })
      }
      return acc
    },
    [] as Array<{ name: string; value: number; attendees: number }>
  )

  const attendanceData = events
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 10)
    .map((event) => ({
      name: event.title.substring(0, 15),
      attendees: event.attendees,
      capacity: event.maxAttendees,
    }))

  const ratingDistribution = [0, 0, 0, 0, 0]
  feedback.forEach((f) => {
    ratingDistribution[f.rating - 1]++
  })

  const ratingData = [
    { name: '1 Star', value: ratingDistribution[0] },
    { name: '2 Stars', value: ratingDistribution[1] },
    { name: '3 Stars', value: ratingDistribution[2] },
    { name: '4 Stars', value: ratingDistribution[3] },
    { name: '5 Stars', value: ratingDistribution[4] },
  ]

  const priceRangeData = [
    { range: '<$50', count: events.filter((e) => e.price < 50).length },
    { range: '$50-$100', count: events.filter((e) => e.price >= 50 && e.price < 100).length },
    { range: '$100-$150', count: events.filter((e) => e.price >= 100 && e.price < 150).length },
    { range: '>$150', count: events.filter((e) => e.price >= 150).length },
  ]

  // Calculate statistics
  const totalAttendees = events.reduce((sum, e) => sum + e.attendees, 0)
  const totalCapacity = events.reduce((sum, e) => sum + e.maxAttendees, 0)
  const avgRating = feedback.length > 0 ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1) : 'N/A'
  const totalRevenue = events.reduce((sum, e) => sum + e.price * e.attendees, 0)

  const COLORS = ['oklch(0.5 0.17 192)', 'oklch(0.6 0.18 280)', 'oklch(0.65 0.15 30)', 'oklch(0.45 0.16 150)', 'oklch(0.7 0.12 80)']

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into EventSphere performance and user engagement
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: Calendar,
              label: 'Total Events',
              value: events.length,
              color: 'text-primary',
            },
            {
              icon: Users,
              label: 'Total Attendees',
              value: totalAttendees,
              color: 'text-blue-500',
            },
            {
              icon: DollarSign,
              label: 'Total Revenue',
              value: `$${totalRevenue.toLocaleString()}`,
              color: 'text-green-500',
            },
            {
              icon: Award,
              label: 'Avg Rating',
              value: avgRating,
              color: 'text-amber-500',
            },
          ].map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div
                key={idx}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Events by Category */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Events by Category
            </h2>
            {eventsByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={eventsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0 0)" />
                  <XAxis dataKey="name" stroke="oklch(0.56 0 0)" />
                  <YAxis stroke="oklch(0.56 0 0)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.18 0 0)',
                      border: '1px solid oklch(0.28 0 0)',
                      borderRadius: '0.5rem',
                      color: 'oklch(0.95 0 0)',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="oklch(0.5 0.17 192)" name="Event Count" />
                  <Bar dataKey="attendees" fill="oklch(0.6 0.18 280)" name="Total Attendees" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-12">No data available</p>
            )}
          </div>

          {/* Attendance Trend */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Attendance by Event
            </h2>
            {attendanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0 0)" />
                  <XAxis dataKey="name" stroke="oklch(0.56 0 0)" />
                  <YAxis stroke="oklch(0.56 0 0)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.18 0 0)',
                      border: '1px solid oklch(0.28 0 0)',
                      borderRadius: '0.5rem',
                      color: 'oklch(0.95 0 0)',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="attendees"
                    stroke="oklch(0.5 0.17 192)"
                    strokeWidth={2}
                    dot={{ fill: 'oklch(0.5 0.17 192)' }}
                    name="Attendees"
                  />
                  <Line
                    type="monotone"
                    dataKey="capacity"
                    stroke="oklch(0.65 0.15 30)"
                    strokeWidth={2}
                    dot={{ fill: 'oklch(0.65 0.15 30)' }}
                    name="Capacity"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-12">No data available</p>
            )}
          </div>
        </div>

        {/* Second Row Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Rating Distribution */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Rating Distribution
            </h2>
            {feedback.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ratingData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => (value > 0 ? `${name}: ${value}` : '')}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.18 0 0)',
                      border: '1px solid oklch(0.28 0 0)',
                      borderRadius: '0.5rem',
                      color: 'oklch(0.95 0 0)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-12">No feedback data available</p>
            )}
          </div>

          {/* Price Range Distribution */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Price Range Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priceRangeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0 0)" />
                <XAxis dataKey="range" stroke="oklch(0.56 0 0)" />
                <YAxis stroke="oklch(0.56 0 0)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.18 0 0)',
                    border: '1px solid oklch(0.28 0 0)',
                    borderRadius: '0.5rem',
                    color: 'oklch(0.95 0 0)',
                  }}
                />
                <Bar dataKey="count" fill="oklch(0.45 0.16 150)" name="Number of Events" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="mt-8 bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Key Metrics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Capacity Utilization</p>
              <p className="text-2xl font-bold text-primary">
                {totalCapacity > 0
                  ? ((totalAttendees / totalCapacity) * 100).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Average Event Size</p>
              <p className="text-2xl font-bold text-primary">
                {events.length > 0 ? (totalAttendees / events.length).toFixed(0) : 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Feedback Submissions</p>
              <p className="text-2xl font-bold text-primary">{feedback.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Average Ticket Price</p>
              <p className="text-2xl font-bold text-primary">
                ${events.length > 0 ? (events.reduce((sum, e) => sum + e.price, 0) / events.length).toFixed(0) : 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Most Popular Category</p>
              <p className="text-2xl font-bold text-primary">
                {eventsByCategory.length > 0
                  ? eventsByCategory.reduce((prev, current) =>
                      prev.value > current.value ? prev : current
                    ).name
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Satisfaction Score</p>
              <p className="text-2xl font-bold text-primary">{avgRating}/5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
