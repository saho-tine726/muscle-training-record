"use client";

import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import useUser, { useRequireAuth } from "@/hooks/useUser";

type updatePostType = {
  title: string;
  content: string;
  uuid: string;
};

const EditPost = ({ params }: { params: { uuid: string } }) => {
  const { session } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<updatePostType>({
    defaultValues: {
      title: "",
      content: "",
      uuid: params.uuid,
    },
  });

  useRequireAuth();

  useEffect(() => {
    const getPostByUuid = async (uuid: string) => {
      const res = await fetch(`/api/post/${uuid}`);
      const data = await res.json();
      return data.post;
    };

    getPostByUuid(params.uuid)
      .then((data) => {
        setValue("title", data.title);
        setValue("content", data.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [params.uuid, setValue]);


  const updatePost = async (data: updatePostType) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/post/${data.uuid}`, {
        method: "PUT",
        body: JSON.stringify({ title: data.title, content: data.content }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("更新に失敗しました。");
      }

      setLoading(false);
      router.push("/post");
    } catch (error) {
      console.error("更新エラー:", error);
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<updatePostType> = async (data) => {
    updatePost(data);
  };

  if (!session) {
    return null;
  }

  return (
    <main className="max-w-[1000px] mx-auto py-6">
      <div className="px-6 py-10 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">編集ページ</h1>

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
            {loading ? "編集中..." : "編集"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default EditPost;