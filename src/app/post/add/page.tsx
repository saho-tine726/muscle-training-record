"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import useUser, { useRequireAuth } from "@/hooks/useUser";
import { BodyPart } from "@prisma/client";
import { formatDate } from "@/hooks/useDate";
import { bodyParts, exerciseNames, exercises } from "@/constants/formMap";

type FormValues = {
  exercises: {
    [key in BodyPart]: {
      exercise: string | undefined
      weight: number;
      repetitions: number;
    }
  };
  authorId: number;
};

const AddPost = () => {
  const { session, user } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useRequireAuth();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      exercises: {
        CHEST: { exercise: "", weight: 0, repetitions: 0 },
        BACK: { exercise: "", weight: 0, repetitions: 0 },
        LEGS: { exercise: "", weight: 0, repetitions: 0 },
        SHOULDERS: { exercise: "", weight: 0, repetitions: 0 },
        ARMS: { exercise: "", weight: 0, repetitions: 0 },
      },
      authorId: 0,
    },
  });

  // useEffect(() => {
  //   // フォームの初期値を設定する
  //   Object.keys(exercises).forEach((bodyPart) => {
  //     setValue(`exercises.${bodyPart as BodyPart}.exercise`, "");
  //   });
  // }, [setValue]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);

    try {
      const res = await fetch("/api/post/", {
        cache: "no-store", // SSR
        method: "POST",
        body: JSON.stringify({
          authorId: user?.id,
          exerciseEntries: data.exercises
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

  const today = new Date();

  if (!session) {
    return null;
  };

  return (
    <main className="max-w-[1000px] mx-auto py-6">
      <div className="px-6 py-10 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-2 text-center">本日のトレーニング追加</h1>

        <p className="mb-4 text-center font-medium">今日の日付：{formatDate(today.toISOString())}</p>

        <div className="mb-6">
          <Link href="/post/" className="bg-gray-500 px-3 sm:px-4 py-2 rounded-md text-white text-md font-medium transition duration-500 hover:bg-gray-600">トレーニング記録全一覧へ</Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {Object.keys(exercises).map((bodyPart) => (
            <div key={bodyPart} className="mb-4 bg-gray-200 p-4 rounded-md">
              <p className="mb-3 font-bold text-2xl border-l-8 border-gray-600 pl-3">{bodyParts[bodyPart as BodyPart]}</p>
              <div className="flex align-center gap-8 mb-2">
                <dl className="col-span-2">
                  <dt className="font-medium mb-1">種目</dt>
                  <dd>
                    <select
                      {...register(`exercises.${bodyPart as BodyPart}.exercise`)}
                      className="w-96 py-1 px-3 cursor-pointer"
                    >
                      <option value="" disabled>選択してください</option>
                      {exercises[bodyPart as BodyPart].map((exercise) => (
                        <option key={exercise} value={exercise}>{exerciseNames[exercise]}</option>
                      ))}
                    </select>
                  </dd>
                </dl>
                <dl>
                  <dt className="font-medium mb-1">重量</dt>
                  <dd className="flex align-center gap-3">
                    <input
                      type="number"
                      {...register(`exercises.${bodyPart as BodyPart}.weight`)}
                      className="w-24 py-1 px-3"
                    />
                    <span className="grow-0 shrink-0">kg</span>
                  </dd>
                </dl>
                <dl>
                  <dt className="font-medium mb-1">回数</dt>
                  <dd className="flex align-center gap-3">
                    <input
                      type="number"
                      {...register(`exercises.${bodyPart as BodyPart}.repetitions`)}
                      className="w-24 py-1 px-3"
                    />
                    <span className="grow-0 shrink-0">回</span>
                  </dd>
                </dl>
              </div>
              <div className="mt-4">
                <button className="bg-gray-500 w-7 h-7 flex align-center justify-center font-bold text-white text-lg">＋</button>
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 text-lg rounded-md transition duration-500 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
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