"use client";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useRequireAuth } from "@/hooks/useUser";
import { BodyPart } from "@prisma/client";
import { bodyParts, exerciseNames, exercises } from "@/constants/formMap";
import { SyncLoader } from "react-spinners";
import { sessionState } from "@/states/authState";
import { useRecoilValue } from "recoil";
import { formatDate } from "@/app/utils/formatData";
import { useSubmitPost } from "@/hooks/useSubmitPost";
import { useFieldArrays } from "@/hooks/useFieldArrays";
import { useFetchPostDetail } from "@/hooks/useFetchPostDetail";

type FormValues = {
  exercises: {
    [key in BodyPart]: { exercise: string; weight: number; repetitions: number }[];
  };
  authorId: number;
  id: string;
};

const PostDetail = () => {
  const { updatePost } = useSubmitPost();
  const session = useRecoilValue(sessionState);
  const router = useRouter();

  useRequireAuth();

  const postId = usePathname().split('/').pop();

  const {
    register,
    handleSubmit,
    control,
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

  // 各ボディパートごとのフィールド配列を設定
  const fieldArrays = useFieldArrays(control);

  // 既存のデータを取得してフォームにセット
  const { loading, setLoading, post } = useFetchPostDetail(control, fieldArrays);

  // その日の記録を全て削除
  const handleDeleteAll = async () => {
    try {
      await fetch(`/api/post/detail/${postId}`, {
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

  // 各エクササイズごとの削除
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
        <main className="max-w-[1200px] mx-auto pt-2 md:pt-6 pb-10 px-4 md:px-10">
          <div className="px-6 py-10 bg-gray-100 rounded-lg shadow-lg">
            <h1 className="text-xl md:text-2xl font-bold mb-6 text-center border-b-2 border-gray-900 pb-2 w-fit mr-auto ml-auto">{post && formatDate(post.createdAt)}の<br className="md:hidden" />トレーニング記録</h1>

            <div className="mb-4 text-right">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md transition duration-500 hover:bg-red-700 focus:outline-none focus:ring focus:border-blue-500"
                onClick={handleDeleteAll}
              >この日付の記録を全て削除
              </button>
            </div>

            <form onSubmit={handleSubmit(updatePost)}>
              {Object.keys(exercises).map((bodyPart) => {
                const { fields, append } = fieldArrays[bodyPart as BodyPart];

                return (
                  <div key={bodyPart} className="mb-4 bg-gray-200 p-4 rounded-md">
                    <p className="mb-3 font-bold text-2xl border-l-8 border-gray-600 pl-3">{bodyParts[bodyPart as BodyPart]}</p>
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex flex-col lg:flex-row align-center gap-3 md:gap-8 mb-8 md:mb-2">
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
                        <div className="self-end">
                          <button
                            type="button"
                            className="bg-teal-600 text-white py-2 px-3 rounded-md transition text-sm duration-500 hover:bg-teal-700 focus:outline-none focus:ring focus:border-blue-500"
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
