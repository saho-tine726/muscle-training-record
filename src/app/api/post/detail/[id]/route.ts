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
          update: exerciseEntries.map((entry: ExerciseEntry) => ({
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

// export const PUT = async (req: Request) => {
//   try {
//     const { exerciseEntries } = await req.json();

//     const id: string = req.url.split("/post/detail/")[1];

//     await doConnect();

//     // 既存のエントリを削除して、新しいエントリを追加
//     await prisma.exerciseEntry.deleteMany({
//       where: {
//         postId: id,
//       },
//     });

//     const updatedEntries = exerciseEntries.map((entry: any) => ({
//       bodyPart: entry.bodyPart,
//       exercise: entry.exercise,
//       weight: entry.weight,
//       repetitions: entry.repetitions,
//       postId: id, // ここでpostIdを設定
//     }));

//     const post = await prisma.post.update({
//       where: { id },
//       data: {
//         exerciseEntries: {
//           create: updatedEntries,
//         },
//       },
//     });
//     return NextResponse.json({ message: "Success", post }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: "Error", error }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// };

// post詳細記事 削除API
export const DELETE = async (req: Request, res: NextResponse) => {
  try {
    const id: string = req.url.split("/post/detail/")[1];

    await doConnect();

    const post = await prisma.post.delete({
      where: {
        id,
      },
    });
    return NextResponse.json({ message: "Success", post }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
