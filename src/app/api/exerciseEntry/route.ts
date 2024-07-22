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

// 全exerciseEntry取得API
export const GET = async (req: Request, res: NextResponse) => {
  const url = new URL(req.url);
  const bodyPart = url.searchParams.get("bodyPart");

  try {
    await doConnect();

    if (!bodyPart) {
      return NextResponse.json(
        { message: "BodyPart is required" },
        { status: 400 }
      );
    }

    const exerciseEntries = await prisma.exerciseEntry.findMany({
      where: { bodyPart: bodyPart as any },
      include: { post: true }, // Post データも含める
    });
    return NextResponse.json(
      { message: "Success", exerciseEntries },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
