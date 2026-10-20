import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateRank } from '@/lib/ranks';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const questionId = params.id;
    const { content, userEmail, isAccepted = true } = await req.json();

    const user = await prisma.user.findFirst({
      where: userEmail ? { email: userEmail } : undefined,
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { user: true },
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const answer = await prisma.answer.create({
      data: {
        content,
        isAccepted,
        questionId,
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

    if (isAccepted) {
      await prisma.question.update({
        where: { id: questionId },
        data: { isSolved: true },
      });
    }

    // Award +25 XP to answering student
    const newXP = user.xp + 25;
    const newRank = calculateRank(newXP);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        xp: newXP,
        rankTitle: newRank.title,
      },
    });

    // Notify question author
    if (question.userId !== user.id) {
      await prisma.notification.create({
        data: {
          userId: question.userId,
          title: '💡 Doubt Answered!',
          message: `${user.name} posted a solution to your doubt`,
          type: 'ANSWERED',
        },
      });
    }

    return NextResponse.json({ answer, xpAwarded: 25, newTotalXP: newXP });
  } catch (error: any) {
    console.error('Error adding answer:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
