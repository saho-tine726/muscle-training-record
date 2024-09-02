import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BodyPart } from "@prisma/client";
import { useRecoilValue } from 'recoil';
import { userState } from "@/states/authState";
import { SubmitHandler } from "react-hook-form";

type FormValues = {
  exercises: {
    [key in BodyPart]: { exercise: string; weight: number; repetitions: number }[];
  };
  authorId: number;
};

export const useSubmitPost = () => {
  const user = useRecoilValue(userState);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const postId = usePathname().split('/').pop();

  // 本日のトレーニング記録フォーム
  const submitTodayPost: SubmitHandler<FormValues> = async (data) => {
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

  // 詳細ページのフォーム
  const updatePost: SubmitHandler<FormValues> = async (data) => {
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

  return { submitTodayPost, updatePost }
}