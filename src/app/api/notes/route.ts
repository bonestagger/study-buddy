import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateRank } from '@/lib/ranks';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    const search = searchParams.get('search');

    const where: any = {};
    if (subject && subject !== 'ALL') {
      where.subject = subject;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { subject: { contains: search } },
      ];
    }

    const notes = await prisma.note.findMany({
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
        kudos: true,
        bookmarks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(notes);
  } catch (error: any) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, subject, type, dueDate, dueDay, dueTime, fileUrl, pageCount, userEmail } = body;

    // Find the user by email or get the default student
    const user = await prisma.user.findFirst({
      where: userEmail ? { email: userEmail } : undefined,
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isHomework = type === 'HW';
    const note = await prisma.note.create({
      data: {
        title,
        subject,
        type,
        isHomework,
        dueDate: dueDate ? new Date(dueDate) : null,
        dueDay,
        dueTime,
        fileUrl: fileUrl || '/sheets/math-factorisation.json',
        pageCount: pageCount || 1,
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

    // Award +50 XP
    const newXP = user.xp + 50;
    const newRank = calculateRank(newXP);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        xp: newXP,
        rankTitle: newRank.title,
      },
    });

    // Create notifications for classmates
    const otherClassmates = await prisma.user.findMany({
      where: { id: { not: user.id } },
      select: { id: true },
    });

    for (const classmate of otherClassmates) {
      await prisma.notification.create({
        data: {
          userId: classmate.id,
          title: isHomework ? `⏰ New Homework Alert!` : `📝 New ${subject} Notes Shared!`,
          message: `${user.name} shared "${title}"`,
          type: isHomework ? 'HOMEWORK_DUE' : 'NOTE_UPLOADED',
        },
      });
    }

    return NextResponse.json({ note, xpAwarded: 50, newTotalXP: newXP });
  } catch (error: any) {
    console.error('Error creating note:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
