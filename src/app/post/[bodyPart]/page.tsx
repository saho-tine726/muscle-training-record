"use client";
import Link from "next/link";
import { Post } from "@/types/post";
import { useRequireAuth } from "@/hooks/useUser";
import { bodyPartsMap } from "@/constants/bodyPartsMap";
import { exercisesMap } from "@/constants/exercisesMap";
import { BodyPartsLinks } from "@/app/components/BodyPartsLinks";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, LineController } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useParams } from "next/navigation";
import { ChartData, ChartDataset } from 'chart.js';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { loadingState, sessionState, userState } from "@/states/authState";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { formatDate } from "@/app/utils/formatData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  LineController
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        color: 'black'
      }
    },
  }
};

const BodyPartList = () => {
  const user = useRecoilValue(userState);
  const session = useRecoilValue(sessionState);
  const loading = useRecoilValue(loadingState);
  const setLoading = useSetRecoilState(loadingState);
  const [sortedPosts, setSortedPosts] = useState<Post[]>([]);
  const { bodyPart } = useParams<{ bodyPart: string }>();

  const fetchPosts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/post?userId=${user.id}`);
      const data = await response.json();
      // 投稿を日付の降順に並べ替える
      const sortedPosts = data.posts.sort((a: Post, b: Post) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return sortedPosts;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }

  useRequireAuth();

  useEffect(() => {
    setLoading(true);
    fetchPosts().then((posts) => setSortedPosts(posts));
  }, [user]);

  if (!session) {
    return null;
  }

  // グラフ用のMM年DD日変換
  function graphFormatDate(dateString: string): string {
    const date = new Date(dateString);
    const month = date.toLocaleString('ja-JP', { month: '2-digit' });
    const day = date.toLocaleString('ja-JP', { day: '2-digit' });

    return `${month}${day}`;
  }

  // データが存在する日付を抽出
  const datesWithData: string[] = Array.from(new Set(sortedPosts.map(post => graphFormatDate(post.createdAt))));

  // 最新30件の日付を取得
  const latestDates = datesWithData.slice(0, 30);

  // 指定された部位のトレーニング記録がある投稿だけをフィルタリング
  const filteredPosts = sortedPosts.filter((post: Post) =>
    post.exerciseEntries.some(entry => entry.bodyPart === bodyPart.toUpperCase())
  );

  // チャートのデータ
  const data: ChartData<'bar', number[], string> = {
    labels: latestDates,
    datasets: [
      {
        type: 'bar' as const,
        label: "負荷量（重量 × 回数）の推移",
        data: latestDates.map(date => {
          const total = filteredPosts
            .filter(post => graphFormatDate(post.createdAt) === date)
            .reduce((sum, post) => sum + post.exerciseEntries
              .filter(entry => entry.bodyPart === bodyPart.toUpperCase())
              .reduce((total, entry) => total + (entry.weight * entry.repetitions), 0), 0);
          return total > 0 ? total : 0;
        }),
        backgroundColor: "rgba(233, 42, 42, 0.5)"
      },
      {
        type: 'line' as const,
        label: "トレーニング負荷（折れ線）",
        data: latestDates.map(date => {
          const total = filteredPosts
            .filter(post => graphFormatDate(post.createdAt) === date)
            .reduce((sum, post) => sum + post.exerciseEntries
              .filter(entry => entry.bodyPart === bodyPart.toUpperCase())
              .reduce((total, entry) => total + (entry.weight * entry.repetitions), 0), 0);
          return total > 0 ? total : 0;
        }),
        borderColor: "rgba(233, 42, 42, 1)",
        backgroundColor: "rgba(233, 42, 42, 0.2)",
        fill: true,
      }
    ] as ChartDataset<'bar', number[]>[]
  };

  return (
    <>
      <title>各部位ごとの一覧</title>
      <main className="max-w-[1200px] mx-auto pt-2 md:pt-6 pb-10 px-4 md:px-10">
        {loading ? (
          <div className="flex justify-center items-center flex-col mt-10 gap-10">
            <SyncLoader size={15} color={"#F3F4F6"} />
          </div>
        ) : (
          <div className="px-3 md:px-6 py-5 md:py-10 bg-gray-100 rounded-lg shadow-lg">
            <h1 className="text-xl md:text-2xl font-bold mb-6 text-center border-b-2 border-gray-900 pb-2 w-fit mr-auto ml-auto">
              トレーニング記録 「{bodyPartsMap[bodyPart.toUpperCase()]}」 一覧
            </h1>

            <BodyPartsLinks />

            <div className="mb-8">
              <Link href="/post/" className="bg-gray-500 px-3 sm:px-4 py-2 rounded-md text-white text-md font-medium transition duration-500 hover:bg-gray-600">トレーニング記録全一覧へ</Link>
            </div>

            <div className="md:h-96 md:w-3/4 mx-auto">
              <Bar options={options} data={data} />
            </div>

            <div className="mt-5 md:mt-8">
              {filteredPosts.length ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                  {filteredPosts.map((post: Post) => (
                    <div key={post.id} className="bg-gray-300 rounded-lg p-3 flex flex-col justify-between">
                      <div>
                        <p className="font-bold text-sm md:text-md border-b-2 border-gray-900 pb-1">{formatDate(post.createdAt)}</p>
                        <ul className="mt-2 flex flex-col gap-2">
                          {post.exerciseEntries.map((exerciseEntry, i) => (
                            exerciseEntry.bodyPart === bodyPart.toUpperCase() && (
                              <li key={exerciseEntry.id} className="flex gap-x-2 gap-y-0.5 flex-wrap text-xs bg-white py-1 px-1.5 rounded-md">
                                <b>{i + 1}.</b><span className="block w-11 bg-teal-500 text-white text-xs font-medium flex items-center justify-center">{bodyPartsMap[exerciseEntry.bodyPart]}</span><span><b>{exercisesMap[exerciseEntry.exercise]}</b></span><span className="flex gap-1 text-gray-500"><span>{exerciseEntry.weight}kg</span><span>×</span><span>{exerciseEntry.repetitions}回</span></span>
                              </li>
                            )
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4 mb-1 text-right">
                        <Link href={`/post/detail/${post.id}`} className="bg-pink-500 px-3 py-2 rounded-md text-white text-xs md:text-sm font-medium transition duration-500 hover:bg-pink-600">詳細を見る</Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center">データがありません</p>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default BodyPartList;
