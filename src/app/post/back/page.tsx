"use client";
import Link from "next/link";
import { PostType } from "@/types/post";
import useUser, { useRequireAuth } from "@/hooks/useUser";
import { formatDate } from "@/hooks/useDate";
import { bodyPartsMap } from "@/constants/bodyPartsMap";
import { exercisesMap } from "@/constants/exercisesMap";
import { BodyPartsLinks } from "@/app/components/BodyPartsLinks";
import { BodyPart } from "@prisma/client";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, Title } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      labels: false
    },
  },
  title: {
    display: true,
    text: "Chart.js Bar Chart"
  }
};


const BodyPartList = () => {
  const { session, user } = useUser();

  useRequireAuth();

  if (!session) {
    return null;
  }

  // 投稿を日付の降順に並べ替える
  const sortedPosts = user?.posts
    ? [...user.posts].sort((a: PostType, b: PostType) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  // データが存在する日付を抽出
  const datesWithData = Array.from(new Set(sortedPosts.map(post => formatDate(post.createdAt))));

  // 最新7件の日付を取得
  const latestDates = datesWithData.slice(0, 7);

  // "胸" のトレーニング記録がある投稿だけをフィルタリング
  const backPosts = sortedPosts.filter((post: PostType) =>
    post.exerciseEntries.some(entry => entry.bodyPart === BodyPart.BACK)
  );

  // チャートのデータ
  const data = {
    labels: latestDates, // x軸のラベルとして最新7件の日付を使用
    datasets: [
      {
        type: 'bar', // 棒グラフ
        label: "負荷量（重量 × 回数）の推移",
        data: latestDates.map(date => {
          const total = backPosts
            .filter(post => formatDate(post.createdAt) === date)
            .reduce((sum, post) => sum + post.exerciseEntries
              .filter(entry => entry.bodyPart === BodyPart.BACK)
              .reduce((total, entry) => total + (entry.weight * entry.repetitions), 0), 0);
          return total > 0 ? total : 0; // グラフには0を表示
        }),
        backgroundColor: "rgba(233, 42, 42, 0.5)" // グラフの棒の色
      },
      {
        type: 'line', // 折れ線グラフ
        label: "トレーニング負荷（折れ線）",
        data: latestDates.map(date => {
          const total = backPosts
            .filter(post => formatDate(post.createdAt) === date)
            .reduce((sum, post) => sum + post.exerciseEntries
              .filter(entry => entry.bodyPart === BodyPart.BACK)
              .reduce((total, entry) => total + (entry.weight * entry.repetitions), 0), 0);
          return total > 0 ? total : 0; // グラフには0を表示
        }),
        borderColor: "rgba(233, 42, 42, 1)", // 折れ線の色
        backgroundColor: "rgba(233, 42, 42, 0.2)", // 折れ線の下の塗りつぶし色
        fill: true, // 折れ線の下を塗りつぶす
      }
    ]
  };

  return (
    <main className="max-w-[1000px] mx-auto py-6">
      <div className="px-6 py-10 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center border-b-2 border-gray-900 pb-2 w-fit mr-auto ml-auto">トレーニング記録 「背中」 一覧</h1>

        <BodyPartsLinks />

        <Bar options={options} data={data} />

        {backPosts.length ? (
          <div className="grid grid-cols-3 gap-4 mt-6">
            {backPosts.map((post: PostType) => (
              <div key={post.id} className="bg-gray-300 rounded-lg p-4 flex flex-col justify-between">
                <div>
                  <p className="font-bold text-lg border-b-2 border-gray-900 pb-1">{formatDate(post.createdAt)}</p>
                  <ul className="mt-2 flex flex-col gap-2.5">
                    {post.exerciseEntries.map((exerciseEntry, i) => (
                      exerciseEntry.bodyPart === BodyPart.BACK && (
                        <li key={exerciseEntry.id} className="flex gap-x-2 gap-y-0.5 flex-wrap text-sm">
                          <b>{i + 1}.</b><span className="block w-11 bg-teal-500 text-white text-sm font-medium flex items-center justify-center">{bodyPartsMap[exerciseEntry.bodyPart]}</span><span><b>{exercisesMap[exerciseEntry.exercise]}</b></span><span className="flex gap-1 text-gray-500"><span>{exerciseEntry.weight}kg</span><span>×</span><span>{exerciseEntry.repetitions}回</span></span>
                        </li>
                      )
                    ))}
                  </ul>
                </div>
                <div className="mt-4 mb-1 text-right">
                  <Link href={`/post/detail/${post.id}`} className="bg-pink-500 px-3 py-2 rounded-md text-white text-sm font-medium transition duration-500 hover:bg-pink-600">詳細を見る</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">データがありません</p>
        )}
      </div>
    </main>
  );
};

export default BodyPartList;
