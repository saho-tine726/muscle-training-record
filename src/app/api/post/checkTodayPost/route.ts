import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/libs/prisma';

// 本日のトレーニングが既に記録されているか確認するAPI
export const GET = async (req: NextRequest) => {
  try {
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { message: 'userId is required' },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
        createdAt: {
          gte: today,
        },
      },
      include: {
        exerciseEntries: true,
      },
    });

    const hasTodayTraining = posts.length > 0;

    return NextResponse.json({ hasTodayTraining, posts }, { status: 200 });
  } catch (error) {
    console.error('checkTodayPost Error:', error);
    return NextResponse.json({ message: 'Error', error }, { status: 500 });
  }
};
