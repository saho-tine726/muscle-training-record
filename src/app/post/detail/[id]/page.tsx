"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import useUser, { useRequireAuth } from "@/hooks/useUser";
import { BodyPart } from "@prisma/client";
import { bodyParts, exerciseNames, exercises } from "@/constants/formMap";
import AllPostListLink from "@/app/components/AllPostListLink";
import { useRecoilValue } from "recoil";
import { sessionState, userState } from "@/states/authState";
import { usePathname } from "next/navigation";

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
  const router = useRouter();
  const postId = usePathname().split('/').pop();
  // useRequireAuth();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
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

  // useFieldArrayをボディパートごとに設定する
  const fieldArrays = Object.keys(exercises).reduce((acc, bodyPart) => {
    acc[bodyPart] = useFieldArray({
      control,
      name: `exercises.${bodyPart as BodyPart}` as `exercises.${BodyPart}`,
    });
    return acc;
  }, {} as Record<BodyPart, ReturnType<typeof useFieldArray>>);

  useEffect(() => {
    if (user) {
      // 既存のデータを取得してフォームにセットする処理を追加
      fetch(`/api/post/detail/${postId}`)
        .then((res) => res.json())
        .then((data) => {
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
            fieldArrays[bodyPart as BodyPart].replace([]);
            // 新しいエントリを追加
            entries.forEach((entry) => {
              fieldArrays[bodyPart as BodyPart].append({
                exercise: entry.exercise,
                weight: entry.weight,
                repetitions: entry.repetitions,
              });
            });
          });
        });
    }
  }, [user, postId, setValue]);

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

      const res = await fetch(`/api/post/detail/${data.id}`, {
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

  if (!session) {
    return null;
  }

  return (
    <main className="max-w-[1000px] mx-auto py-6">
      <div className="px-6 py-10 bg-gray-100 rounded-lg shadow-lg">
        {/* <h1 className="text-2xl font-bold mb-2 text-center">{formatDate(post.createdAt)}のトレーニング記録</h1> */}
        <h1 className="text-2xl font-bold mb-2 text-center">0000/00/00のトレーニング記録</h1>

        <AllPostListLink />

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
            {/* <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 text-lg rounded-md transition duration-500 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
              disabled={loading}
            >
              {loading ? "更新中..." : "更新"}
            </button> */}
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 text-lg rounded-md transition duration-500 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
            >
              更新
            </button>
            <button
              className="bg-red-600 text-white px-6 py-3 text-lg rounded-md transition duration-500 hover:bg-red700 focus:outline-none focus:ring focus:border-blue-500"
            >この日付のデータを全て削除
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default PostDetail;
