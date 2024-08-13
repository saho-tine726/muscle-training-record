import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// DB接続
async function doConnect() {
  try {
    await prisma.$connect();
  } catch (error) {
    return Error("DB接続に失敗しました");
  }
}

// 本日のトレーニングが既に記録されているか確認するAPI
export const GET = async (req: Request, res: NextResponse) => {
  try {
    await doConnect();

    // const today = new Date();
    // today.setHours(0, 0, 0, 0); // 今日の日付の00:00:00を取得

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) return;

    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
        createdAt: {
          gte: today,
        },
      },
      include: {
        exerciseEntries: true,
      }
    });

    if (posts.length > 0) {
      return NextResponse.json({ message: "Training already recorded today", posts }, { status: 200 });
    } else {
      return NextResponse.json({ message: "No training recorded today" }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};