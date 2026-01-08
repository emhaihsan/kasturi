import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * POST /api/user/sync
 * Sync user data from Privy to database
 * Handles both wallet and email authentication
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, email, displayName } = body;

    // Validate: must have either wallet or email
    if (!walletAddress && !email) {
      return NextResponse.json(
        { error: 'Either wallet address or email is required' },
        { status: 400 }
      );
    }

    // Normalize wallet address
    const normalizedWallet = walletAddress?.toLowerCase();

    // Find or create user
    let user;

    if (normalizedWallet) {
      // Try to find by wallet first
      user = await prisma.user.findUnique({
        where: { walletAddress: normalizedWallet },
        include: {
          progress: {
            include: {
              lesson: {
                select: {
                  id: true,
                  title: true,
                  expReward: true,
                  programId: true,
                },
              },
            },
          },
          credentials: true,
        },
      });

      if (!user) {
        // Create new user with wallet
        user = await prisma.user.create({
          data: {
            walletAddress: normalizedWallet,
            email: email || null,
            displayName: displayName || null,
          },
          include: {
            progress: {
              include: {
                lesson: {
                  select: {
                    id: true,
                    title: true,
                    expReward: true,
                    programId: true,
                  },
                },
              },
            },
            credentials: true,
          },
        });
      } else if (email && !user.email) {
        // Update email if user logged in with wallet first, then connected email
        user = await prisma.user.update({
          where: { id: user.id },
          data: { email, displayName: displayName || user.displayName },
          include: {
            progress: {
              include: {
                lesson: {
                  select: {
                    id: true,
                    title: true,
                    expReward: true,
                    programId: true,
                  },
                },
              },
            },
            credentials: true,
          },
        });
      }
    } else if (email) {
      // Email-only login (Privy creates embedded wallet)
      user = await prisma.user.findFirst({
        where: { email },
        include: {
          progress: {
            include: {
              lesson: {
                select: {
                  id: true,
                  title: true,
                  expReward: true,
                  programId: true,
                },
              },
            },
          },
          credentials: true,
        },
      });

      if (!user) {
        // For email-only users, we need a placeholder wallet address
        // Privy will provide the embedded wallet address later
        const placeholderWallet = `email_${email.replace('@', '_at_')}`.toLowerCase();
        
        user = await prisma.user.create({
          data: {
            walletAddress: placeholderWallet,
            email,
            displayName: displayName || email.split('@')[0],
          },
          include: {
            progress: {
              include: {
                lesson: {
                  select: {
                    id: true,
                    title: true,
                    expReward: true,
                    programId: true,
                  },
                },
              },
            },
            credentials: true,
          },
        });
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create or find user' },
        { status: 500 }
      );
    }

    // Calculate total EXP from completed lessons
    const totalExp = user.progress.reduce((sum, p) => sum + p.expEarned, 0);

    // Transform progress to match frontend format
    const progressMap: Record<string, {
      completed: boolean;
      score: number;
      expEarned: number;
      completedAt: string | null;
    }> = {};

    user.progress.forEach((p) => {
      progressMap[p.lessonId] = {
        completed: true,
        score: p.score || 0,
        expEarned: p.expEarned,
        completedAt: p.completedAt.toISOString(),
      };
    });

    // Return user data in frontend-compatible format
    return NextResponse.json({
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        email: user.email || undefined,
        name: user.displayName || undefined,
        totalExp,
        tokenBalance: 0, // TODO: fetch from smart contract
        credentials: user.credentials.map((c) => ({
          id: c.id,
          programId: c.programId,
          txHash: c.txHash,
          issuedAt: c.issuedAt.toISOString(),
        })),
        vouchers: [], // TODO: implement voucher system
        progress: progressMap,
      },
    });
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json(
      { error: 'Failed to sync user data' },
      { status: 500 }
    );
  }
}
