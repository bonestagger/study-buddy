import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateRank } from '@/lib/ranks';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = params.id;
    const { userEmail } = await req.json();

    const currentUser = await prisma.user.findFirst({
      where: userEmail ? { email: userEmail } : undefined,
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: { user: true },
    });

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    // Check if already given
    const existingKudo = await prisma.kudo.findUnique({
      where: {
        noteId_userId: {
          noteId,
          userId: currentUser.id,
        },
      },
    });

    if (existingKudo) {
      // Toggle off
      await prisma.kudo.delete({
        where: { id: existingKudo.id },
      });
      const updated = await prisma.note.update({
        where: { id: noteId },
        data: { kudosCount: Math.max(0, note.kudosCount - 1) },
      });
      return NextResponse.json({ kudosCount: updated.kudosCount, active: false });
    } else {
      // Create kudo
      await prisma.kudo.create({
        data: {
          noteId,
          userId: currentUser.id,
        },
      });

      const updated = await prisma.note.update({
        where: { id: noteId },
        data: { kudosCount: note.kudosCount + 1 },
      });

      // Award +10 XP to note author
      const author = note.user;
      const newXP = author.xp + 10;
      const newRank = calculateRank(newXP);
      await prisma.user.update({
        where: { id: author.id },
        data: { xp: newXP, rankTitle: newRank.title },
      });

      return NextResponse.json({ kudosCount: updated.kudosCount, active: true, xpAwarded: 10 });
    }
  } catch (error: any) {
    console.error('Error toggling kudos:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
