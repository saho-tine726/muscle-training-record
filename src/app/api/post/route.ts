import { NextResponse } from "next/server";
import { ExerciseEntry, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// DB接続
async function doConnect() {
  try {
    await prisma.$connect();
  } catch (error) {
    return Error("DB接続に失敗しました");
  }
}

// 全post取得API
export const GET = async (req: Request, res: NextResponse) => {
  try {
    await doConnect();
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) return;

    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        exerciseEntries: true,
      }
    });
    return NextResponse.json({ message: "Success", posts }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

// post投稿API
export const POST = async (req: Request, res: NextResponse) => {
  try {
    await doConnect();

    const { exerciseEntries, authorId } = await req.json();

    const post = await prisma.post.create({
      data: {
        authorId,
        exerciseEntries: {
          create: exerciseEntries.map((entry: ExerciseEntry) => ({
            bodyPart: entry.bodyPart,
            exercise: entry.exercise,
            weight: entry.weight,
            repetitions: entry.repetitions,
          })),
        },
      },
      include: {
        exerciseEntries: true,
      },
    });

    return NextResponse.json({ message: "Success", post }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
