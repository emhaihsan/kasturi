import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      where: { isActive: true },
      include: {
        modules: {
          where: { isActive: true },
          include: {
            lessons: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    // Calculate lesson count for each program
    const programsWithLessonCount = programs.map(program => ({
      id: program.id,
      programId: program.programId,
      name: program.name,
      description: program.description,
      language: program.language,
      level: 'beginner',
      totalExp: program.totalExp,
      lessonCount: program.modules.reduce((sum, module) => sum + module.lessons.length, 0),
    }));

    return NextResponse.json({ programs: programsWithLessonCount });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}
