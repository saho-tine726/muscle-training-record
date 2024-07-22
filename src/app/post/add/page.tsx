"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import useUser, { useRequireAuth } from "@/hooks/useUser";

const AddPost = () => {
  const { session, user, } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useRequireAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ title: string; content: string; authorId: number }>({
    defaultValues: {
      title: "",
      content: "",
      authorId: 0,
    },
  });

  const onSubmit: SubmitHandler<{
    title: string;
    content: string;
    authorId: number;
  }> = async (data) => {
    setLoading(true);

    try {
      const res = await fetch("/api/post/", {
        cache: "no-store", // SSR
        method: "POST",
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          authorId: user?.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      router.push("/post");
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  if (!session) {
    return null;
  };

  return (
    <main className="max-w-[1000px] mx-auto py-6">
      <div className="px-6 py-10 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">TODOを追加</h1>

        <div className="mb-6">
          <Link href="/post/" className="bg-gray-500 px-3 sm:px-4 py-2 rounded-md text-white text-md font-medium transition duration-500 hover:bg-gray-600">やること一覧へ戻る</Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <p className="mb-2 font-medium">タイトル</p>
            <input
              id="title"
              type="text"
              placeholder="タイトル"
              {...register("title", {
                required: {
                  value: true,
                  message: "タイトルを入力してください",
                },
              })}
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
            />
            {errors.title && (
              <div className="text-red-500 text-sm">{errors.title.message}</div>
            )}
          </div>

          <div className="mb-4">
            <p className="mb-2 font-medium">内容</p>
            <input
              id="content"
              type="text"
              placeholder="内容"
              {...register("content", {
                required: {
                  value: true,
                  message: "内容を入力してください",
                },
              })}
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
            />
            {errors.content && (
              <div className="text-red-500 text-sm">{errors.content.message}</div>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
            disabled={loading}
          >
            {loading ? "追加中..." : "追加"}
          </button>

        </form>
      </div>
    </main>
  );
};

export default AddPost;