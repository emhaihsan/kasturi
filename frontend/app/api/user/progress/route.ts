import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/user/progress - Get user's learning progress
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      );
    }

    // Get user with progress
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
      include: {
        progress: {
          include: {
            lesson: {
              include: {
                module: {
                  include: {
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
            },
          },
          orderBy: { completedAt: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json({
        user: null,
        totalExp: 0,
        completedLessons: 0,
        programs: [],
      });
    }

    // Calculate stats
    const totalExp = user.progress.reduce((sum: number, p: any) => sum + p.expEarned, 0);
    const completedLessons = user.progress.length;

    // Group by program
    const programMap = new Map<string, {
      program: { id: string; programId: string; name: string; language: string };
      completedLessons: number;
      totalLessons: number;
      expEarned: number;
    }>();

    for (const p of user.progress) {
      const program = p.lesson.module.program;
      const programId = program.id;
      if (!programMap.has(programId)) {
        const totalLessons = await prisma.lesson.count({
          where: { 
            module: {
              programId: programId
            },
            isActive: true 
          },
        });
        programMap.set(programId, {
          program: program,
          completedLessons: 0,
          totalLessons,
          expEarned: 0,
        });
      }
      const entry = programMap.get(programId)!;
      entry.completedLessons += 1;
      entry.expEarned += p.expEarned;
    }

    return NextResponse.json({
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        displayName: user.displayName,
      },
      totalExp,
      completedLessons,
      programs: Array.from(programMap.values()).map(p => ({
        program: p.program,
        completedLessons: p.completedLessons,
        totalLessons: p.totalLessons,
        expEarned: p.expEarned,
      })),
      recentProgress: user.progress.slice(0, 10),
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}
