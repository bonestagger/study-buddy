import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const questionId = params.id;
    const question = await prisma.question.update({
      where: { id: questionId },
      data: {
        upvotes: { increment: 1 },
      },
    });

    return NextResponse.json({ upvotes: question.upvotes });
  } catch (error: any) {
    console.error('Error upvoting question:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
