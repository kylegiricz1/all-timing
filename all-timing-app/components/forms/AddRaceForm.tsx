'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface AddRaceFormProps {
  onSuccess?: () => void
}

export default function AddRaceForm({ onSuccess }: AddRaceFormProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    url: '',
    source: '',
    location: '',
    distance: '',
    description: '',
    level: '',
    surface: '',
  })

  // Check if user has Pro subscription
  const isPro = session?.user && (session.user as any).subscriptionStatus === 'active'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/races', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date).toISOString(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create race')
      }

      // Reset form
      setFormData({
        name: '',
        date: '',
        url: '',
        source: '',
        location: '',
        distance: '',
        description: '',
        level: '',
        surface: '',
      })

      router.refresh()
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Race Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="e.g., Boston Marathon 2024"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
            Distance
          </label>
          <select
            id="distance"
            name="distance"
            value={formData.distance}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select distance</option>
            <option value="5K">5K</option>
            <option value="10K">10K</option>
            <option value="Half Marathon">Half Marathon</option>
            <option value="Marathon">Marathon</option>
            <option value="Ultra">Ultra</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
          Results URL *
        </label>
        <input
          type="url"
          id="url"
          name="url"
          required
          value={formData.url}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="https://..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="e.g., Boston, MA"
          />
        </div>

        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
            Source
          </label>
          <input
            type="text"
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="e.g., Athlinks, RunSignUp"
          />
        </div>
      </div>

      {/* PREMIUM FIELDS */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Advanced Details {!isPro && <span className="text-primary-600">🔒 Pro</span>}
          </h3>
          {!isPro && (
            <Link
              href="/pricing"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Upgrade to unlock
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
              Race Level {!isPro && '🔒'}
            </label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              disabled={!isPro}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select level</option>
              <option value="High School">High School</option>
              <option value="College">College</option>
              <option value="Pro">Pro</option>
              <option value="Amateur">Amateur</option>
              <option value="Masters">Masters</option>
            </select>
          </div>

          <div>
            <label htmlFor="surface" className="block text-sm font-medium text-gray-700 mb-1">
              Surface Type {!isPro && '🔒'}
            </label>
            <select
              id="surface"
              name="surface"
              value={formData.surface}
              onChange={handleChange}
              disabled={!isPro}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select surface</option>
              <option value="Road">Road</option>
              <option value="Trail">Trail</option>
              <option value="Track">Track</option>
              <option value="Cross Country">Cross Country</option>
            </select>
          </div>
        </div>

        {!isPro && (
          <p className="mt-3 text-sm text-gray-600">
            💡 Upgrade to Pro to track race level and surface type
          </p>
        )}

        {!isPro && (
          <p className="mt-3 text-sm text-gray-600">
            💡 Upgrade to Pro to track race level, surface type, and weather conditions
          </p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Optional notes about this race..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
      >
        {loading ? 'Adding Race...' : 'Add Race'}
      </button>
    </form>
  )
}