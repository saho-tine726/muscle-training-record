import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

// 全exerciseEntry取得API
export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const bodyPart = url.searchParams.get('bodyPart');

  if (!bodyPart) {
    return NextResponse.json(
      { message: 'BodyPart is required' },
      { status: 400 }
    );
  }

  try {
    const exerciseEntries = await prisma.exerciseEntry.findMany({
      where: { bodyPart: bodyPart as any },
      include: { post: true },
    });
    return NextResponse.json(
      { message: 'Success', exerciseEntries },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json({ message: 'Error', error }, { status: 500 });
  }
};
