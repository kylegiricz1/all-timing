'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import RaceCard from '@/components/RaceCard'
import Link from 'next/link'

interface Race {
  id: string
  name: string
  date: string
  url: string
  source?: string
  location?: string
  distance?: string
  description?: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [races, setRaces] = useState<Race[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchRaces()
    }
  }, [status, search, sourceFilter])

  const fetchRaces = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (sourceFilter) params.append('source', sourceFilter)

      const response = await fetch(`/api/races?${params}`)
      const data = await response.json()

      if (response.ok) {
        setRaces(data.races)
      }
    } catch (error) {
      console.error('Error fetching races:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this race?')) return

    try {
      const response = await fetch(`/api/races/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setRaces(races.filter((race) => race.id !== id))
      }
    } catch (error) {
      console.error('Error deleting race:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  // Get unique sources for filter
  const sources = Array.from(new Set(races.map((r) => r.source).filter(Boolean)))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Race Results
        </h1>
        <p className="text-gray-600">
          Welcome back, {session.user?.name || session.user?.email}!
        </p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by race name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Sources</option>
          {sources.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
        <Link
          href="/dashboard/add-race"
          className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium whitespace-nowrap"
        >
          + Add Race
        </Link>
      </div>

      {races.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🏃</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No races yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start adding your race results to keep track of your achievements!
          </p>
          <Link
            href="/dashboard/add-race"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
          >
            Add Your First Race
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {races.map((race) => (
            <RaceCard
              key={race.id}
              race={race}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-600">
        Total races: {races.length}
      </div>
    </div>
  )
}