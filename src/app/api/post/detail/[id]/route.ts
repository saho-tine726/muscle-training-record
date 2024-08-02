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

// post詳細記事 取得API
export const GET = async (req: Request, res: NextResponse) => {
  try {
    const id: string = req.url.split("/post/detail/")[1];

    await doConnect();

    const post = await prisma.post.findFirst({
      where: {
        id,
      },
      include: {
        exerciseEntries: true,
      },
    });
    return NextResponse.json({ message: "Success", post }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

// post詳細記事 編集API
export const PUT = async (req: Request, res: NextResponse) => {
  try {
    const { authorId, exerciseEntries } = await req.json();

    const id: string = req.url.split("/post/detail/")[1];

    await doConnect();

    const post = await prisma.post.update({
      where: {
        id,
      },
      data: {
        authorId,
        exerciseEntries: {
          // 削除して再作成する形に変更
          deleteMany: {},
          create: exerciseEntries.map((entry: ExerciseEntry) => ({
            bodyPart: entry.bodyPart,
            exercise: entry.exercise,
            weight: entry.weight,
            repetitions: entry.repetitions,
          })),
        },
      },
    });
    return NextResponse.json({ message: "Success", post }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

// post詳細記事 削除API
export const DELETE = async (req: Request, res: NextResponse) => {
  try {
    const id: string = req.url.split("/post/detail/")[1];

    console.log("Deleting post with ID:", id);

    await doConnect();

    const post = await prisma.post.delete({
      where: {
        id,
      },
    });
    return NextResponse.json({ message: "Success", post }, { status: 200 });
  } catch (error) {
    console.error("Delete Error:", error); // エラーをログに記録
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
