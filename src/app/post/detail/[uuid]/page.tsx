"use client";

import { useState, useEffect } from 'react';
import { SyncLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useUser, { useRequireAuth } from "@/hooks/useUser";
import { PostType } from "@/types/post";
import { formatDate } from "@/hooks/useDate";

const getPostByUuid = async (uuid: string) => {
  const res = await fetch(`/api/post/detail/${uuid}`);
  const data = await res.json();
  return data.post;
};

// const deletePost = async (uuid: string) => {
//   const res = fetch(`/api/post/detail/${uuid}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   return (await res).json();
// };

const DetailPost = ({ params }: { params: { uuid: string } }) => {
  const { session } = useUser();
  const [post, setPost] = useState<PostType | null>(null);
  const router = useRouter();

  useRequireAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPostByUuid(params.uuid);
        setPost(postData);
      } catch (error) {
        console.error('ポストの取得中にエラーが発生しました:', error);
      }
    };

    fetchPost();
  }, [params.uuid]);

  // const handleDelete = async () => {
  //   await deletePost(params.uuid);

  //   router.push("/post");
  //   router.refresh();
  // };

  if (!post) {
    return (
      <div className="flex justify-center items-center mt-10">
        <SyncLoader size={15} color={"#F3F4F6"} loading={!post} />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="max-w-[1000px] mx-auto py-6">
      <div className="px-6 py-10 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center border-b-2 border-gray-900 pb-2 w-fit mr-auto ml-auto">{formatDate(post.createdAt)}のトレーニング記録</h1>
        <p>{post.uuid}</p>
        <p>{post.exerciseEntries[0].bodyPart}</p>
        <p>{post.exerciseEntries[0].exercise}</p>
        <p>{post.exerciseEntries[0].weight}</p>
        <p>{post.exerciseEntries[0].repetitions}</p>
      </div>
    </main >
  )
}

export default DetailPost;
