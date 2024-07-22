"use client";

import { useState, useEffect } from 'react';
import { SyncLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useUser, { useRequireAuth } from "@/hooks/useUser";

const getPostByUuid = async (uuid: string) => {
  const res = await fetch(`/api/post/${uuid}`);
  const data = await res.json();
  return data.post;
};

const deletePost = async (uuid: string) => {
  const res = fetch(`/api/post/${uuid}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return (await res).json();
};

const DetailPost = ({ params }: { params: { uuid: string } }) => {
  const { session } = useUser();
  const [post, setPost] = useState<{ title: string, content: string, uuid: string } | null>(null);
  const router = useRouter();

  useRequireAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPostByUuid(params.uuid);
        setPost(postData);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [params.uuid]);

  const handleDelete = async () => {
    await deletePost(params.uuid);

    router.push("/post");
    router.refresh();
  };

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
        <h1 className="text-2xl font-bold mb-4 text-center">詳細ページ</h1>

        <div className="mb-6">
          <Link href="/post/" className="bg-gray-500 px-3 sm:px-4 py-2 rounded-md text-white text-md font-medium transition duration-500 hover:bg-gray-600">やること一覧へ戻る</Link>
        </div>

        <div className="bg-gray-300 rounded-lg p-4 mb-4">
          <p className="text-2xl font-semibold">{post.title}</p>
          <p className="text-gray-600 text-lg mt-2">{post.content}</p>
          <div className="flex gap-3 justify-end mt-4">
            <Link href={`/post/${post.uuid}/edit`} type="button" className="bg-green-600 px-3 sm:px-5 py-2 rounded-md text-white text-sm sm:text-md font-medium transition duration-500 hover:bg-green-800">編集</Link>
            <button type="button" className="bg-gray-500 px-3 sm:px-5 py-2 rounded-md text-white text-sm sm:text-md font-medium transition duration-500 hover:bg-gray-600" onClick={handleDelete}>削除</button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DetailPost;
