'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AddRaceForm from '@/components/forms/AddRaceForm'
import Link from 'next/link'

export default function AddRace() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="text-primary-600 hover:text-primary-700 font-medium mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Add New Race Result
        </h1>
        <p className="text-gray-600">
          Add a race result to your collection
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg">
        <AddRaceForm
          onSuccess={() => {
            router.push('/dashboard')
          }}
        />
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Tip</h3>
        <p className="text-sm text-blue-800">
          You can find race results on platforms like Athlinks, RunSignUp,
          ChronoTrack, and other timing services. Just paste the URL to your
          specific race results page!
        </p>
      </div>
    </div>
  )
}