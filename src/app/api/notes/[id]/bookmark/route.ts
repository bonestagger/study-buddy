import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        noteId_userId: {
          noteId,
          userId: currentUser.id,
        },
      },
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      });
      return NextResponse.json({ bookmarked: false });
    } else {
      await prisma.bookmark.create({
        data: {
          noteId,
          userId: currentUser.id,
        },
      });
      return NextResponse.json({ bookmarked: true });
    }
  } catch (error: any) {
    console.error('Error toggling bookmark:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
