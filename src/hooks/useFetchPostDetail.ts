import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { usePathname } from "next/navigation";
import { Control } from "react-hook-form";
import { userState } from "@/states/authState";
import { BodyPart } from "@prisma/client";

export const useFetchPostDetail = (control: Control<any>, fieldArrays: any) => {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(undefined);
  const user = useRecoilValue(userState);
  const postId = usePathname().split('/').pop();

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

  return { loading, setLoading, post };
};
