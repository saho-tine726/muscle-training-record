"use client";
import Link from "next/link";
import useUser, { formatDate, useRequireAuth } from "@/hooks/useUser";
import { PostType } from "@/types/post";

const PostList = () => {
  const { session, user } = useUser();

  const bodyPartsMap: { [key: string]: string } = {
    "chest": "胸",
    "back": "背中",
    "legs": "脚",
    "shoulders": "肩",
    "arms": "腕"
  };

  useRequireAuth();

  console.log("User posts:", user?.posts);

  if (!session) {
    return null;
  }

  return (
    <main className="max-w-[1000px] mx-auto py-6">
      <div className="px-6 py-10 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-2 text-center">トレーニング記録全一覧</h1>

        <div className="mb-6 border border-gray-700 p-3 mt-4">
          <p className="font-bold mb-4">部位ごとの一覧ページ</p>
          <div className="grid grid-cols-5 gap-6">
            {Object.keys(bodyPartsMap).map(part => (
              <div key={part}>
                <Link href={`post/${part}`} className="py-2 bg-blue-500 text-white font-bold text-lg flex items-center justify-center">
                  {bodyPartsMap[part]}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <Link href="/post/add" className="bg-teal-500 px-3 sm:px-4 py-2 rounded-md text-white text-md font-medium transition duration-500 hover:bg-teal-600">本日のトレーニングを追加する</Link>
        </div>

        {user?.posts.length ? (
          <div className="grid grid-cols-3 gap-10">
            {user?.posts.map((post: PostType) => (
              <div key={post.uuid} className="bg-gray-300 rounded-lg p-4">
                <p className="font-bold text-lg">{formatDate(post.createdAt)}</p>
                <ul className="mt-1">
                  {post.exerciseEntries?.map((exerciseEntry) => (
                    <li key={exerciseEntry.uuid}>
                      ・{exerciseEntry.bodyPart} {exerciseEntry.exercise} {exerciseEntry.weight}kg {exerciseEntry.repetitions}回
                    </li>
                  ))}
                </ul>
                <div className="mt-4 mb-1 text-right">
                  <Link href="" className="bg-pink-500 px-3 py-2 rounded-md text-white text-sm font-medium transition duration-500 hover:bg-pink-600">詳細を見る</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">データがありません</p>
        )}

        <p className="mt-10 mb-2">※理想は以下のような形です</p>
        <div className="grid grid-cols-3 gap-10">
          <div className="bg-gray-300 rounded-lg p-4">
            <p className="font-bold text-lg">2024/07/22</p>
            <ul className="mt-1">
              <li>
                ・胸 ベンチプレス 10kg 20回
              </li>
              <li>
                ・胸 チェストプレス 10kg 20回
              </li>
              <li>
                ・背中 ラットプルダウン 10kg 20回
              </li>
            </ul>
            <div className="mt-4 mb-1 text-right">
              <Link href="" className="bg-pink-500 px-3 py-2 rounded-md text-white text-sm font-medium transition duration-500 hover:bg-pink-600">詳細を見る</Link>
            </div>
          </div>
          <div className="bg-gray-300 rounded-lg p-4">
            <p className="font-bold text-lg">2024/07/21</p>
            <ul className="mt-1">
              <li>
                ・胸 ベンチプレス 10kg 20回
              </li>
              <li>
                ・胸 チェストプレス 10kg 20回
              </li>
              <li>
                ・背中 ラットプルダウン 10kg 20回
              </li>
            </ul>
            <div className="mt-4 mb-1 text-right">
              <Link href="" className="bg-pink-500 px-3 py-2 rounded-md text-white text-sm font-medium transition duration-500 hover:bg-pink-600">詳細を見る</Link>
            </div>
          </div>
          <div className="bg-gray-300 rounded-lg p-4">
            <p className="font-bold text-lg">2024/07/20</p>
            <ul className="mt-1">
              <li>
                ・胸 ベンチプレス 10kg 20回
              </li>
              <li>
                ・胸 チェストプレス 10kg 20回
              </li>
              <li>
                ・背中 ラットプルダウン 10kg 20回
              </li>
            </ul>
            <div className="mt-4 mb-1 text-right">
              <Link href="" className="bg-pink-500 px-3 py-2 rounded-md text-white text-sm font-medium transition duration-500 hover:bg-pink-600">詳細を見る</Link>
            </div>
          </div>
        </div>
      </div>
    </main >
  );
};

export default PostList;