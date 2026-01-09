import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/programs/[languageId] - Get program by language code with modules
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ languageId: string }> }
) {
  try {
    const { languageId } = await params;

    // Try to find by programId first, then by language code
    let program = await prisma.program.findFirst({
      where: {
        OR: [
          { programId: languageId },
          { language: languageId },
        ],
        isActive: true,
      },
      include: {
        modules: {
          where: { isActive: true },
          orderBy: { orderIndex: 'asc' },
          include: {
            _count: {
              select: { lessons: true },
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

    // Get user progress if authenticated
    const walletAddress = request.headers.get('x-wallet-address');
    let userProgress: Record<string, boolean> = {};
    
    if (walletAddress) {
      const user = await prisma.user.findUnique({
        where: { walletAddress: walletAddress.toLowerCase() },
        include: {
          progress: {
            select: { lessonId: true },
          },
        },
      });
      
      if (user) {
        userProgress = user.progress.reduce((acc, p) => {
          acc[p.lessonId] = true;
          return acc;
        }, {} as Record<string, boolean>);
      }
    }

    // Calculate completed lessons per module
    const modulesWithProgress = await Promise.all(
      program.modules.map(async (module) => {
        const lessons = await prisma.lesson.findMany({
          where: { moduleId: module.id, isActive: true },
          select: { id: true },
        });
        
        const completedLessons = lessons.filter(l => userProgress[l.id]).length;
        
        return {
          id: module.id,
          moduleId: module.moduleId,
          name: module.name,
          description: module.description,
          level: module.level,
          totalExp: module.totalExp,
          orderIndex: module.orderIndex,
          lessonCount: module._count.lessons,
          completedLessons,
        };
      })
    );

    return NextResponse.json({
      program: {
        id: program.id,
        programId: program.programId,
        name: program.name,
        description: program.description,
        language: program.language,
        totalExp: program.totalExp,
        modules: modulesWithProgress,
      },
    });
  } catch (error) {
    console.error('Error fetching program:', error);
    return NextResponse.json(
      { error: 'Failed to fetch program' },
      { status: 500 }
    );
  }
}
