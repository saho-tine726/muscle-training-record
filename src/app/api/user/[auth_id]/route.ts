import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

// ユーザー情報 取得API
export const GET = async (req: Request) => {
  try {
    const auth_id = req.url.split('/user/')[1];
    if (!auth_id) {
      return NextResponse.json(
        { message: 'auth_id is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { auth_id },
      include: {
        posts: {
          include: {
            exerciseEntries: true,
          },
        },
      },
    });

    return NextResponse.json({ message: 'Success', user }, { status: 200 });
  } catch (error) {
    console.error('GET /api/user/[auth_id] Error:', error);
    return NextResponse.json({ message: 'Error', error }, { status: 500 });
  }
};

// ユーザー情報 編集API
export const PUT = async (req: Request) => {
  try {
    const auth_id = req.url.split('/user/')[1];
    if (!auth_id) {
      return NextResponse.json(
        { message: 'auth_id is required' },
        { status: 400 }
      );
    }

    const { email, name } = await req.json();

    const user = await prisma.user.update({
      where: { auth_id },
      data: {
        email,
        name,
      },
    });

    return NextResponse.json({ message: 'Success', user }, { status: 200 });
  } catch (error) {
    console.error('PUT /api/user/[auth_id] Error:', error);
    return NextResponse.json({ message: 'Error', error }, { status: 500 });
  }
};

// ユーザー情報 登録API
export const POST = async (req: Request) => {
  try {
    const { auth_id, email } = await req.json();
    if (!auth_id || !email) {
      return NextResponse.json(
        { message: 'auth_id and email are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        auth_id,
        email,
      },
    });

    return NextResponse.json({ message: 'Success', user }, { status: 201 });
  } catch (error) {
    console.error('POST /api/user/[auth_id] Error:', error);
    return NextResponse.json({ message: 'Error', error }, { status: 500 });
  }
};
