"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { useRequireAuth } from "@/hooks/useUser";
import { BodyPart } from "@prisma/client";
import { bodyParts, exerciseNames, exercises } from "@/constants/formMap";
import { SyncLoader } from "react-spinners";
import { sessionState, userState } from "@/states/authState";
import { useRecoilValue } from "recoil";
import { formatDate } from "@/hooks/useDate";

type FormValues = {
  exercises: {
    [key in BodyPart]: { exercise: string; weight: number; repetitions: number }[];
  };
  authorId: number;
  id: string;
};

const PostDetail = () => {
  const user = useRecoilValue(userState);
  const session = useRecoilValue(sessionState);

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);
  const router = useRouter();

  useRequireAuth();

  const postId = usePathname().split('/').pop();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      exercises: {
        CHEST: [],
        BACK: [],
        LEGS: [],
        SHOULDERS: [],
        ARMS: [],
      },
      authorId: 0,
      id: '',
    },
  });

  // useFieldArrayをボディパートごとに設定する
  const fieldArrays = {
    CHEST: useFieldArray({ control, name: "exercises.CHEST" }),
    BACK: useFieldArray({ control, name: "exercises.BACK" }),
    LEGS: useFieldArray({ control, name: "exercises.LEGS" }),
    SHOULDERS: useFieldArray({ control, name: "exercises.SHOULDERS" }),
    ARMS: useFieldArray({ control, name: "exercises.ARMS" }),
  };

  useEffect(() => {
    if (user && postId) {
      // 既存のデータを取得してフォームにセットする処理を追加
      fetch(`/api/post/detail/${postId}`)
        .then((res) => res.json())
        .then((data) => {
          setPost(data.post);
          setLoading(false);

          const entriesByBodyPart: Record<BodyPart, any[]> = {
            CHEST: [],
            BACK: [],
            LEGS: [],
            SHOULDERS: [],
            ARMS: [],
          };

          data.post.exerciseEntries.forEach((entry: any) => {
            entriesByBodyPart[entry.bodyPart as BodyPart].push(entry);
          });

          Object.keys(entriesByBodyPart).forEach((bodyPart) => {
            const entries = entriesByBodyPart[bodyPart as BodyPart];
            // 既存のフィールドをリセット
            fieldArrays[bodyPart as BodyPart].replace(entries.map(entry => ({
              exercise: entry.exercise,
              weight: entry.weight,
              repetitions: entry.repetitions,
            })));
          });
        });
    }
  }, [user, postId]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!user) return;

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

      const res = await fetch(`/api/post/detail/${postId}`, {
        method: "PUT",
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

  const handleDeleteAll = async () => {
    try {
      const res = await fetch(`/api/post/detail/${postId}`, {
        method: "DELETE",
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
  }

  const handleDeleteExercise = (bodyPart: BodyPart, index: number) => {
    fieldArrays[bodyPart].remove(index);
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <title>トレーニング記録詳細</title>
      {loading ? (
        <div className="flex justify-center items-center flex-col mt-10 gap-10">
          <SyncLoader size={15} color={"#F3F4F6"} />
        </div>
      ) : (
        <main className="max-w-[1000px] mx-auto py-6">
          <div className="px-6 py-10 bg-gray-100 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-2 text-center">{post && formatDate(post.createdAt)}のトレーニング記録</h1>

            <div className="mb-4 text-right">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md transition duration-500 hover:bg-red-700 focus:outline-none focus:ring focus:border-blue-500"
                onClick={handleDeleteAll}
              >この日付の記録を全て削除
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {Object.keys(exercises).map((bodyPart) => {
                const { fields, append } = fieldArrays[bodyPart as BodyPart];

                return (
                  <div key={bodyPart} className="mb-4 bg-gray-200 p-4 rounded-md">
                    <p className="mb-3 font-bold text-2xl border-l-8 border-gray-600 pl-3">{bodyParts[bodyPart as BodyPart]}</p>
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex align-center gap-8 mb-2">
                        <dl className="col-span-2">
                          <dt className="font-medium mb-1">種目</dt>
                          <dd>
                            <select
                              {...register(`exercises.${bodyPart as BodyPart}[${index}].exercise`)}
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
                              {...register(`exercises.${bodyPart as BodyPart}[${index}].weight`)}
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
                              {...register(`exercises.${bodyPart as BodyPart}[${index}].repetitions`)}
                              className="w-24 py-1 px-3"
                            />
                            <span className="grow-0 shrink-0">回</span>
                          </dd>
                        </dl>
                        <div className="self-end">
                          <button
                            type="button"
                            className="bg-teal-600 text-white p-2 rounded-md transition text-sm duration-500 hover:bg-teal-700 focus:outline-none focus:ring focus:border-blue-500"
                            onClick={() => handleDeleteExercise(bodyPart as BodyPart, index)}
                          >
                            削除
                          </button>
                        </div>
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

              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-3 text-lg rounded-md transition duration-500 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
                >
                  更新
                </button>
              </div>
            </form>
          </div>
        </main>
      )}
    </>
  );
};

export default PostDetail;
