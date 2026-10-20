import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');

    const where: any = {};
    if (subject && subject !== 'ALL') {
      where.subject = subject;
    }

    const questions = await prisma.question.findMany({
      where,
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
        answers: {
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
            isAccepted: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(questions);
  } catch (error: any) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, subject, userEmail, noteId } = body;

    const user = await prisma.user.findFirst({
      where: userEmail ? { email: userEmail } : undefined,
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const question = await prisma.question.create({
      data: {
        title,
        subject,
        userId: user.id,
        noteId: noteId || null,
        upvotes: 1,
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
        answers: true,
      },
    });

    return NextResponse.json(question);
  } catch (error: any) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
