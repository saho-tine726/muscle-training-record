"use client";
import Link from "next/link";
import useUser, { useRequireAuth } from "@/hooks/useUser";

export default function Home() {
  const { session } = useUser();

  useRequireAuth();

  if (!session) {
    return null;
  }

  return (
    <main className="max-w-[1000px] mx-auto py-6">
      <div className="px-6 py-10 bg-gray-100 rounded-lg shadow-lg">
        <div className="flex align-center justify-center gap-6">
          <div>
            <Link href="/post/add" className="bg-red-600 px-3 sm:px-5 py-2 sm:py-3 rounded-md text-white text-sm sm:text-xl font-medium transition duration-500 hover:bg-red-700">
              本日のトレーニングを追加
            </Link>
          </div>
          <div>
            <Link href="/post" className="bg-cyan-600 px-3 sm:px-5 py-2 sm:py-3 rounded-md text-white text-sm sm:text-xl font-medium transition duration-500 hover:bg-cyan-700">
              トレーニング記録全一覧
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}