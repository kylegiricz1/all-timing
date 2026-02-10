import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const raceSchema = z.object({
  name: z.string().min(1, 'Race name is required'),
  date: z.string().datetime(),
  url: z.string().url('Invalid URL'),
  source: z.string().optional(),
  location: z.string().optional(),
  distance: z.string().optional(),
  description: z.string().optional(),
  level: z.string().optional(),
  surface: z.string().optional(),
})

// GET all races
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const source = searchParams.get('source')

    const races = await prisma.race.findMany({
      where: {
        userId: session.user.id,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { location: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(source && { source }),
      },
      orderBy: {
        date: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ races })
  } catch (error) {
    console.error('Error fetching races:', error)
    return NextResponse.json(
      { error: 'Failed to fetch races' },
      { status: 500 }
    )
  }
}

// POST create a new race
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = raceSchema.parse(body)

    const race = await prisma.race.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
        userId: session.user.id,
      },
    })

    return NextResponse.json({ race }, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Error creating race:', error)
    return NextResponse.json(
      { error: 'Failed to create race' },
      { status: 500 }
    )
  }
}