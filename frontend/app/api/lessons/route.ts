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
          modules: {
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
          },
        },
      });

      const programsWithLessons = programs.map((p) => ({
        id: p.id,
        programId: p.programId,
        name: p.name,
        language: p.language,
        lessons: p.modules.flatMap((m) => m.lessons),
      }));

      return NextResponse.json({ programs: programsWithLessons });
    }

    // Return lessons for specific program
    const program = await prisma.program.findUnique({
      where: { programId },
      include: {
        modules: {
          where: { isActive: true },
          include: {
            lessons: {
              where: { isActive: true },
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
    });

    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    const programWithLessons = {
      id: program.id,
      programId: program.programId,
      name: program.name,
      language: program.language,
      lessons: program.modules.flatMap((m) => m.lessons),
    };

    return NextResponse.json({ program: programWithLessons });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}
