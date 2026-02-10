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
  level?: string
  surface?: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [races, setRaces] = useState<Race[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState('')     // NEW
  const [surfaceFilter, setSurfaceFilter] = useState('') // NEW

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchRaces()
    }
  }, [status, search, sourceFilter, levelFilter, surfaceFilter])

  const fetchRaces = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (sourceFilter) params.append('source', sourceFilter)
      if (levelFilter) params.append('level', levelFilter)
      if (surfaceFilter) params.append('surface', surfaceFilter)

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

  // Check if user has Pro subscription
  const isPro = (session.user as any).subscriptionStatus === 'active'

  // Get unique values for filters
  const sources = Array.from(new Set(races.map((r) => r.source).filter(Boolean)))
  const levels = Array.from(new Set(races.map((r) => r.level).filter(Boolean)))
  const surfaces = Array.from(new Set(races.map((r) => r.surface).filter(Boolean)))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Race Results
            </h1>
            <p className="text-gray-600">
              Welcome back, {session.user?.name || session.user?.email}!
              {isPro && <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-700 rounded text-sm font-semibold">PRO</span>}
            </p>
          </div>
          {!isPro && (
            <Link
              href="/pricing"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              ⭐ Upgrade to Pro
            </Link>
          )}
        </div>
      </div>

      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4">
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
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium whitespace-nowrap text-center"
          >
            + Add Race
          </Link>
        </div>

        {/* Premium Filters */}
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Race Level {!isPro && '🔒'}
            </label>
            <select
              value={levelFilter}
              onChange={(e) => {
                if (!isPro) {
                  router.push('/pricing')
                  return
                }
                setLevelFilter(e.target.value)
              }}
              disabled={!isPro}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">All Levels</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Surface Type {!isPro && '🔒'}
            </label>
            <select
              value={surfaceFilter}
              onChange={(e) => {
                if (!isPro) {
                  router.push('/pricing')
                  return
                }
                setSurfaceFilter(e.target.value)
              }}
              disabled={!isPro}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">All Surfaces</option>
              {surfaces.map((surface) => (
                <option key={surface} value={surface}>
                  {surface}
                </option>
              ))}
            </select>
          </div>

          {!isPro && (
            <div className="flex items-end">
              <Link
                href="/pricing"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm font-medium whitespace-nowrap"
              >
                Unlock Filters
              </Link>
            </div>
          )}
        </div>
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