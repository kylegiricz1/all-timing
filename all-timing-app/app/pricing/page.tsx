'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Pricing() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string, plan: string) => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setLoading(plan)

    try {
      console.log('=== CHECKOUT DEBUG ===')
      console.log('Price ID:', priceId)
      
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()
      console.log('Response status:', response.status)
      console.log('Response data:', data)

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
      setLoading(null)
    }
  }

  const isPro = session?.user && (session.user as any).subscriptionStatus === 'active'

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Upgrade to Pro for advanced race filtering and tracking
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-600">/month</span>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Add unlimited races</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Search by name & location</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>View all race results</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span className="text-gray-400">Advanced filters (level, surface, weather)</span>
              </li>
            </ul>

            {!session ? (
              <Link
                href="/auth/signup"
                className="block w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-center font-medium"
              >
                Sign Up Free
              </Link>
            ) : !isPro ? (
              <div className="w-full px-6 py-3 bg-gray-100 text-gray-600 rounded-md text-center font-medium">
                Current Plan
              </div>
            ) : (
              <div className="w-full px-6 py-3 bg-gray-100 text-gray-400 rounded-md text-center font-medium">
                —
              </div>
            )}
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-primary-600 relative">
            <div className="absolute top-0 right-0 bg-primary-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
              POPULAR
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">$5</span>
              <span className="text-gray-600">/month</span>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Everything in Free</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="font-semibold">Filter by race level (HS, College, Pro)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="font-semibold">Filter by surface (Road, Trail, Track)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="font-semibold">Filter by weather conditions</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Priority support</span>
              </li>
            </ul>

            {!session ? (
              <Link
                href="/auth/signin"
                className="block w-full px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-center font-medium"
              >
                Sign In to Subscribe
              </Link>
            ) : isPro ? (
              <div className="w-full px-6 py-3 bg-green-100 text-green-800 rounded-md text-center font-medium">
                ✓ Current Plan
              </div>
            ) : (
              <button
                onClick={() => handleSubscribe(process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!, 'monthly')}
                disabled={loading === 'monthly'}
                className="w-full px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium disabled:bg-gray-400"
              >
                {loading === 'monthly' ? 'Loading...' : 'Upgrade to Pro'}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-gray-600 mt-8">
          Have questions? <Link href="/" className="text-primary-600 hover:text-primary-700">Contact us</Link>
        </p>
      </div>
    </div>
  )
}