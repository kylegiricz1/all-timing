'use client'

import { formatDate } from '@/lib/utils'

interface Race {
  id: string
  name: string
  date: string | Date
  url: string
  source?: string | null
  location?: string | null
  distance?: string | null
  description?: string | null
}

interface RaceCardProps {
  race: Race
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
}

export default function RaceCard({ race, onDelete, onEdit }: RaceCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {race.name}
          </h3>
          {race.location && (
            <p className="text-sm text-gray-600">{race.location}</p>
          )}
        </div>
        {race.distance && (
          <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
            {race.distance}
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Date:</span>{' '}
          {formatDate(race.date)}
        </p>
        {race.source && (
          <p className="text-sm text-gray-700">
            <span className="font-medium">Source:</span> {race.source}
          </p>
        )}
        {race.description && (
          <p className="text-sm text-gray-600 mt-2">{race.description}</p>
        )}
      </div>

      <div className="flex gap-2">
        <a
          href={race.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-center text-sm font-medium"
        >
          View Results
        </a>
        {onEdit && (
          <button
            onClick={() => onEdit(race.id)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(race.id)}
            className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors text-sm font-medium"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}