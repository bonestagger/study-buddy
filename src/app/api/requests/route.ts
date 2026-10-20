import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const requests = await prisma.noteRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            division: true,
            pfpType: true,
            pfpValue: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(requests);
  } catch (error: any) {
    console.error('Error fetching note requests:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, subject, description, userEmail } = body;

    const user = await prisma.user.findFirst({
      where: userEmail ? { email: userEmail } : undefined,
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const noteRequest = await prisma.noteRequest.create({
      data: {
        title,
        subject,
        description,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            division: true,
            pfpType: true,
            pfpValue: true,
          },
        },
      },
    });

    return NextResponse.json(noteRequest);
  } catch (error: any) {
    console.error('Error creating note request:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
