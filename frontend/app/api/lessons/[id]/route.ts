import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/lessons/[id] - Get a specific lesson by lessonId or internal id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const lesson = await prisma.lesson.findFirst({
      where: {
        OR: [
          { lessonId: id },
          { id: id },
        ],
      },
      include: {
        module: {
          select: {
            id: true,
            moduleId: true,
            name: true,
            program: {
              select: {
                id: true,
                programId: true,
                name: true,
                language: true,
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ lesson });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}
