"use client";
import Link from "next/link";
import { PostType } from "@/types/post";
import useUser, { useRequireAuth } from "@/hooks/useUser";
import { formatDate } from "@/hooks/useDate";
import { bodyPartsMap } from "@/constants/bodyPartsMap";
import { exercisesMap } from "@/constants/exercisesMap";
import { BodyPartsLinks } from "../components/BodyPartsLinks";
import { AddPostLink } from "../components/AddPostLink";

const PostList = () => {
  const { session, user } = useUser();

  useRequireAuth();

  if (!session) {
    return null;
  }

  return (
    <main className="max-w-[1000px] mx-auto py-6">
      <div className="px-6 py-10 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center border-b-2 border-gray-900 pb-2 w-fit mr-auto ml-auto">トレーニング記録全一覧</h1>

        <BodyPartsLinks />

        <AddPostLink />

        {user?.posts.length ? (
          <div className="grid grid-cols-3 gap-4">
            {user?.posts.map((post: PostType) => (
              <div key={post.uuid} className="bg-gray-300 rounded-lg p-4 flex flex-col justify-between">
                <div>
                  <p className="font-bold text-lg">{formatDate(post.createdAt)}</p>
                  <ul className="mt-2 flex flex-col gap-1">
                    {post.exerciseEntries.map((exerciseEntry, i) => (
                      <li key={exerciseEntry.uuid} className="flex gap-1 flex-wrap text-sm">
                        <b>{i + 1}.</b><span className="block w-11 bg-teal-500 text-white text-sm font-medium flex items-center justify-center">{bodyPartsMap[exerciseEntry.bodyPart]}</span><span>{exercisesMap[exerciseEntry.exercise]}</span><span className="flex gap-1"><span>{exerciseEntry.weight}kg</span><span>×</span><span>{exerciseEntry.repetitions}回</span></span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 mb-1 text-right">
                  <Link href={`/post/detail/${post.uuid}`} className="bg-pink-500 px-3 py-2 rounded-md text-white text-sm font-medium transition duration-500 hover:bg-pink-600">詳細を見る</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">データがありません</p>
        )}
      </div>
    </main >
  );
};

export default PostList;
