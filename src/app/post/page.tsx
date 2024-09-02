"use client";
import Link from "next/link";
import { Post } from "@/types/post";
import { useRequireAuth } from "@/hooks/useUser";
import { bodyPartsMap } from "@/constants/bodyPartsMap";
import { exercisesMap } from "@/constants/exercisesMap";
import { BodyPartsLinks } from "../components/BodyPartsLinks";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState, loadingState } from "@/states/authState";
import { useEffect, useState } from "react";
import { formatDate } from "../utils/formatData";
import { useFetchPosts } from "@/hooks/useFetchPosts";

const AllPostList = () => {
  const { loading, setLoading, fetchAllPosts, posts } = useFetchPosts();
  const user = useRecoilValue(userState);

  useRequireAuth();

  useEffect(() => {
    setLoading(true);
    fetchAllPosts();
  }, [user]);

  return (
    <>
      <title>トレーニング記録全一覧</title>
      <main className="max-w-[1200px] mx-auto pt-2 md:pt-6 pb-10 px-4 md:px-10">
        <div className="px-3 md:px-6 py-5 md:py-10 bg-gray-100 rounded-lg shadow-lg">
          <h1 className="text-xl md:text-2xl font-bold mb-6 text-center border-b-2 border-gray-900 pb-2 w-fit mr-auto ml-auto">トレーニング記録全一覧</h1>

          <BodyPartsLinks />

          {loading ? (
            <p className="text-center">Loading....</p>
          ) : posts?.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
              {posts.map((post: Post) => (
                <div key={post.id} className="bg-gray-300 rounded-lg p-3 flex flex-col justify-between">
                  <div>
                    <p className="font-bold text-sm md:text-md border-b-2 border-gray-900 pb-1">{formatDate(post.createdAt)}</p>
                    <ul className="mt-2 flex flex-col gap-2">
                      {post.exerciseEntries.map((exerciseEntry, i) => (
                        <li key={exerciseEntry.id} className="flex gap-x-2 gap-y-0.5 flex-wrap text-xs bg-white py-1 px-1.5 rounded-md">
                          <b>{i + 1}.</b><span className="block w-11 bg-teal-500 text-white text-xs font-medium flex items-center justify-center">{bodyPartsMap[exerciseEntry.bodyPart]}</span><span><b>{exercisesMap[exerciseEntry.exercise]}</b></span><span className="flex gap-1 text-gray-500"><span>{exerciseEntry.weight}kg</span><span>×</span><span>{exerciseEntry.repetitions}回</span></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 mb-1 text-right">
                    <Link href={`/post/detail/${post.id}`} className="bg-pink-500 px-3 py-2 rounded-md text-white text-xs md:text-sm font-medium transition duration-500 hover:bg-pink-600">詳細を見る</Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">データがありません</p>
          )}
        </div>
      </main>
    </>
  );
};

export default AllPostList;
