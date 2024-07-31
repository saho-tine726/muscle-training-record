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
    <main className="max-w-[1200px] mx-auto pt-2 md:pt-6 pb-10 px-4 md:px-10">
      <div className="px-6 py-10 bg-gray-100 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row align-center justify-center gap-x-6 gap-y-12">
          <div className="text-center">
            <Link href="/post/add" className="bg-red-600 px-5 py-2 py-3 rounded-md text-white text-xl font-medium transition duration-500 hover:bg-red-700">
              本日のトレーニングを追加
            </Link>
          </div>
          <div className="text-center">
            <Link href="/post" className="bg-cyan-600 px-5 py-2 py-3 rounded-md text-white text-xl font-medium transition duration-500 hover:bg-cyan-700">
              トレーニング記録全一覧
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}