import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRecoilValue } from 'recoil';
import { userState } from "@/states/authState";
import { PostType } from "@/types/post";

export const useFetchPosts = () => {
  const user = useRecoilValue(userState);
  const [loading, setLoading] = useState(true);
  const [hasTodayPost, setHasTodayPost] = useState(false);
  const [posts, setPosts] = useState<PostType[] | undefined>(undefined);
  const router = useRouter();

  // 今日のデータが既に登録されているかチェック
  const fetchTodayPost = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/post/checkTodayPost?userId=${user.id}`);
      const data = await response.json();
      setHasTodayPost(data.hasTodayTraining);

      if (data.hasTodayTraining) {
        router.push("/post");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // 各ユーザーの全てのデータを取得
  const fetchAllPosts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/post?userId=${user.id}`);
      const data = await response.json();
      setPosts(data.posts.sort((a: PostType, b: PostType) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, setLoading, hasTodayPost, fetchTodayPost, fetchAllPosts, posts };
};