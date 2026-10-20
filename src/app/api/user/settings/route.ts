import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateRank } from '@/lib/ranks';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    const user = await prisma.user.findFirst({
      where: email ? { email } : undefined,
      include: {
        bookmarks: {
          include: {
            note: {
              include: {
                user: {
                  select: {
                    name: true,
                    division: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const rank = calculateRank(user.xp);

    return NextResponse.json({
      ...user,
      currentRank: rank,
    });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { email, division, rollNumber, motto, pfpType, pfpValue, palette, themeMode } = body;

    const user = await prisma.user.findFirst({
      where: email ? { email } : undefined,
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(division && { division }),
        ...(rollNumber !== undefined && { rollNumber }),
        ...(motto && { motto }),
        ...(pfpType && { pfpType }),
        ...(pfpValue && { pfpValue }),
        ...(palette && { palette }),
        ...(themeMode && { themeMode }),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating user settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
