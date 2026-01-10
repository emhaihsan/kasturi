import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/modules/[moduleId] - Get module by ID with lessons
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const { moduleId } = await params;

    const module = await prisma.module.findFirst({
      where: {
        OR: [
          { id: moduleId },
          { moduleId: moduleId },
        ],
        isActive: true,
      },
      include: {
        program: {
          select: {
            id: true,
            programId: true,
            name: true,
            language: true,
          },
        },
        lessons: {
          where: { isActive: true },
          orderBy: { orderIndex: 'asc' },
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            expReward: true,
            orderIndex: true,
            thumbnailUrl: true,
          },
        },
      },
    });

    if (!module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      module: {
        id: module.id,
        moduleId: module.moduleId,
        name: module.name,
        description: module.description,
        level: module.level,
        totalExp: module.totalExp,
        lessons: module.lessons,
        program: module.program,
      },
    });
  } catch (error) {
    console.error('Error fetching module:', error);
    return NextResponse.json(
      { error: 'Failed to fetch module' },
      { status: 500 }
    );
  }
}
