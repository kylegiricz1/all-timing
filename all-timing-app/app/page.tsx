import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Your Race Results,{' '}
          <span className="text-primary-600">All in One Place</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Stop searching through emails and bookmarks. Aggregate all your race
          results in a single, organized dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/auth/signup"
            className="px-8 py-4 bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors text-lg font-semibold"
          >
            Get Started Free
          </Link>
          <Link
            href="/auth/signin"
            className="px-8 py-4 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-lg font-semibold"
          >
            Sign In
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="p-6">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Organize Results</h3>
            <p className="text-gray-600">
              Keep all your race results organized by date, distance, and
              location.
            </p>
          </div>

          <div className="p-6">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Quick Search</h3>
            <p className="text-gray-600">
              Find any race instantly with powerful search and filtering.
            </p>
          </div>

          <div className="p-6">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Direct Links</h3>
            <p className="text-gray-600">
              One-click access to your official results on any timing platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}