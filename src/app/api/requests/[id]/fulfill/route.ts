import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateRank } from '@/lib/ranks';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const requestId = params.id;
    const { userEmail, fulfilledUrl } = await req.json();

    const helper = await prisma.user.findFirst({
      where: userEmail ? { email: userEmail } : undefined,
    });

    if (!helper) {
      return NextResponse.json({ error: 'Helper user not found' }, { status: 404 });
    }

    const noteReq = await prisma.noteRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
    });

    if (!noteReq) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (noteReq.isFulfilled) {
      return NextResponse.json({ error: 'Request already fulfilled' }, { status: 400 });
    }

    // Mark fulfilled
    const updated = await prisma.noteRequest.update({
      where: { id: requestId },
      data: {
        isFulfilled: true,
        fulfilledUrl: fulfilledUrl || '/sheets/chem-valency.json',
      },
    });

    // Award +75 XP to helper
    const newXP = helper.xp + 75;
    const newRank = calculateRank(newXP);
    await prisma.user.update({
      where: { id: helper.id },
      data: {
        xp: newXP,
        rankTitle: newRank.title,
      },
    });

    // Notify requester
    await prisma.notification.create({
      data: {
        userId: noteReq.userId,
        title: '🎉 Notes Received!',
        message: `${helper.name} sent notes for "${noteReq.title}"`,
        type: 'REQUEST_FULFILLED',
      },
    });

    return NextResponse.json({ request: updated, xpAwarded: 75, newTotalXP: newXP });
  } catch (error: any) {
    console.error('Error fulfilling request:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
