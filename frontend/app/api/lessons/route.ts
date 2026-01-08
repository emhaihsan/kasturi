import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/lessons - Get all lessons for a program
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const programId = searchParams.get('programId');

    if (!programId) {
      // Return all active programs with lesson counts
      const programs = await prisma.program.findMany({
        where: { isActive: true },
        include: {
          lessons: {
            where: { isActive: true },
            orderBy: { orderIndex: 'asc' },
            select: {
              id: true,
              title: true,
              description: true,
              expReward: true,
              orderIndex: true,
            },
          },
        },
      });

      return NextResponse.json({ programs });
    }

    // Return lessons for specific program
    const program = await prisma.program.findUnique({
      where: { programId },
      include: {
        lessons: {
          where: { isActive: true },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ program });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}
