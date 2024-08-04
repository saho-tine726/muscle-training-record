"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import useUser, { useRequireAuth } from "@/hooks/useUser";
import { BodyPart } from "@prisma/client";
import { formatDate } from "@/hooks/useDate";
import { bodyParts, exerciseNames, exercises } from "@/constants/formMap";
import { SyncLoader } from "react-spinners";
import Link from "next/link";

type FormValues = {
  exercises: {
    [key in BodyPart]: { exercise: string; weight: number; repetitions: number }[];
  };
  authorId: number;
};

const AddPost = () => {
  const { session, user } = useUser();
  const [loading, setLoading] = useState(true);
  const [hasTodayPost, setHasTodayPost] = useState(true);
  const router = useRouter();

  useRequireAuth();

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  useEffect(() => {
    if (user) {
      fetch(`/api/user/${user.auth_id}`)
        .then((res) => res.json())
        .then((data) => {
          const today = new Date();
          const hasTodayPost = data.user.posts.some((post: { createdAt: string }) => {
            const postDate = new Date(post.createdAt);
            return isSameDay(postDate, today);
          });

          if (hasTodayPost) {
            setHasTodayPost(false);
            router.push("/post");
          } else {
            setLoading(false);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [user]);

  const {
    register,
    handleSubmit,
    control,
  } = useForm<FormValues>({
    defaultValues: {
      exercises: {
        CHEST: [{ exercise: "", weight: 0, repetitions: 0 }],
        BACK: [{ exercise: "", weight: 0, repetitions: 0 }],
        LEGS: [{ exercise: "", weight: 0, repetitions: 0 }],
        SHOULDERS: [{ exercise: "", weight: 0, repetitions: 0 }],
        ARMS: [{ exercise: "", weight: 0, repetitions: 0 }],
      },
      authorId: 0,
    },
  });

  // 各ボディパートごとのフィールド配列を設定
  const fieldArrays = {
    CHEST: useFieldArray({
      control,
      name: "exercises.CHEST",
    }),
    BACK: useFieldArray({
      control,
      name: "exercises.BACK",
    }),
    LEGS: useFieldArray({
      control,
      name: "exercises.LEGS",
    }),
    SHOULDERS: useFieldArray({
      control,
      name: "exercises.SHOULDERS",
    }),
    ARMS: useFieldArray({
      control,
      name: "exercises.ARMS",
    }),
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!user) return;

    setLoading(true);

    try {
      const exerciseEntries = Object.entries(data.exercises)
        .flatMap(([bodyPart, entries]) =>
          entries.map(entry => ({
            bodyPart,
            exercise: entry.exercise,
            weight: Number(entry.weight),
            repetitions: Number(entry.repetitions),
          }))
        )
        .filter(entry => entry.exercise);

      if (exerciseEntries.length === 0) {
        alert("種目を1つ以上登録してください");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/post/", {
        cache: "no-store", // SSR
        method: "POST",
        body: JSON.stringify({
          authorId: user.id,
          exerciseEntries,
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
  }

  return (
    <>
      <title>本日のトレーニング追加</title>
      <main className="max-w-[1200px] mx-auto pt-2 md:pt-6 pb-10 px-4 md:px-10">
        {loading ? (
          <div className="flex justify-center items-center flex-col mt-10 gap-10">
            <SyncLoader size={15} color={"#F3F4F6"} />
            {!hasTodayPost ? (
              <p className="text-white">今日のトレーニング記録は既に登録済です。（一覧ページに飛びます...）</p>
            ) : null}
          </div>
        ) : (
          <div className="px-6 py-10 bg-gray-100 rounded-lg shadow-lg">
            <h1 className="text-xl md:text-2xl font-bold mb-6 text-center border-b-2 border-gray-900 pb-2 w-fit mr-auto ml-auto">本日のトレーニング追加</h1>

            <p className="mb-6 text-center font-medium">今日の日付：{formatDate(today.toISOString())}</p>

            <div className="mb-8">
              <Link href="/post/" className="bg-red-600 px-3 sm:px-4 py-3 rounded-md text-white text-md md:text-lg font-medium transition duration-500 hover:bg-red700">トレーニング記録全一覧へ</Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {Object.keys(exercises).map((bodyPart) => {
                const { fields, append } = fieldArrays[bodyPart as BodyPart];

                return (
                  <div key={bodyPart} className="mb-4 bg-gray-200 p-4 rounded-md">
                    <p className="mb-3 font-bold text-2xl border-l-8 border-gray-600 pl-3">{bodyParts[bodyPart as BodyPart]}</p>
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex flex-col md:flex-row align-center gap-3 md:gap-8 mb-8 md:mb-2">
                        <dl className="col-span-2">
                          <dt className="font-medium mb-1">種目</dt>
                          <dd>
                            <select
                              {...register(`exercises.${bodyPart as BodyPart}.${index}.exercise`)}
                              className="w-full md:w-96 py-1 px-3 cursor-pointer"
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
                              {...register(`exercises.${bodyPart as BodyPart}.${index}.weight`)}
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
                              {...register(`exercises.${bodyPart as BodyPart}.${index}.repetitions`)}
                              className="w-24 py-1 px-3"
                            />
                            <span className="grow-0 shrink-0">回</span>
                          </dd>
                        </dl>
                      </div>
                    ))}
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => append({ exercise: "", weight: 0, repetitions: 0 })}
                        className="bg-gray-500 py-1 px-3 flex align-center justify-center font-font-medium text-white rounded-md text-sm"
                      >
                        ＋ 新しい種目を追加
                      </button>
                    </div>
                  </div>
                );
              })}

              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-3 text-lg rounded-md transition duration-500 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
                disabled={loading}
              >
                {loading ? "追加中..." : "追加"}
              </button>
            </form>

          </div>
        )}
      </main>
    </>
  );
};

export default AddPost;