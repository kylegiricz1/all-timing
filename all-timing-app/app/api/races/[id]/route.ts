import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const raceSchema = z.object({
  name: z.string().min(1, 'Race name is required').optional(),
  date: z.string().datetime().optional(),
  url: z.string().url('Invalid URL').optional(),
  source: z.string().optional(),
  location: z.string().optional(),
  distance: z.string().optional(),
  description: z.string().optional(),
})

// GET single race
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const race = await prisma.race.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!race) {
      return NextResponse.json(
        { error: 'Race not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ race })
  } catch (error) {
    console.error('Error fetching race:', error)
    return NextResponse.json(
      { error: 'Failed to fetch race' },
      { status: 500 }
    )
  }
}

// PATCH update race
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Check if race exists and belongs to user
    const existingRace = await prisma.race.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingRace) {
      return NextResponse.json(
        { error: 'Race not found' },
        { status: 404 }
      )
    }

    const race = await prisma.race.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        ...(validatedData.date && { date: new Date(validatedData.date) }),
      },
    })

    return NextResponse.json({ race })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Error updating race:', error)
    return NextResponse.json(
      { error: 'Failed to update race' },
      { status: 500 }
    )
  }
}

// DELETE race
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if race exists and belongs to user
    const existingRace = await prisma.race.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingRace) {
      return NextResponse.json(
        { error: 'Race not found' },
        { status: 404 }
      )
    }

    await prisma.race.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting race:', error)
    return NextResponse.json(
      { error: 'Failed to delete race' },
      { status: 500 }
    )
  }
}