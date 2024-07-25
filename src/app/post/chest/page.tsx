"use client";
import Link from "next/link";
import { PostType } from "@/types/post";
import useUser, { useRequireAuth } from "@/hooks/useUser";
import { formatDate } from "@/hooks/useDate";
import { bodyPartsMap } from "@/constants/bodyPartsMap";
import { exercisesMap } from "@/constants/exercisesMap";
import { BodyPartsLinks } from "@/app/components/BodyPartsLinks";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2"

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const options = {
//   responsive: true,
//   plugins: {
//     legend: {
//       position: "top"
//     },
//     title: {
//       display: true,
//       text: "Chart.js Bar Chart"
//     }
//   }
// };

// const labels = ["January", "February", "March", "April", "May", "June", "July"];
// const data1 = [12, 11, 14, 52, 14, 32, 36];
// const data2 = [22, 31, 17, 32, 24, 62, 66];

// const data = {
//   labels, // x軸のラベルの配列
//   datasets: [
//     {
//       label: "Dataset 1", // 凡例
//       data: data1,        // データの配列(labelsと要素数同じ)
//       backgroundColor: "rgba(255, 99, 132, 0.5)" // グラフの棒の色
//     },
//     {
//       label: "Dataset 2",
//       data: data2,
//       backgroundColor: "rgba(53, 162, 235, 0.5)"
//     }
//   ]
// };

const chestExercises = new Set([
  "BENCH_PRESS", // ベンチプレス
  "CHEST_PRESS", // チェストプレス
  "DUMBBELL_FLY", // ダンベルフライ
  "DUMBBELL_PRESS", // ダンベルプレス
  "INCLINE_DUMBBELL_PRESS", // インクラインダンベルプレス
  "PEC_FLY" // ペクトラルフライ
]);

const BodyPartList = () => {
  const { session, user } = useUser();

  useRequireAuth();

  if (!session) {
    return null;
  }

  const filteredPosts = (user?.posts as PostType[]).filter(post =>
    post.exerciseEntries.some(entry => chestExercises.has(entry.exercise))
  ) || [];

  return (
    <main className="max-w-[1000px] mx-auto py-6">
      <div className="px-6 py-10 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center border-b-2 border-gray-900 pb-2 w-fit mr-auto ml-auto">トレーニング記録【胸】一覧</h1>

        <BodyPartsLinks />

        {/* <div>
          <Bar options={options} data={data} />
        </div> */}

        {filteredPosts.length ? (
          <div className="grid grid-cols-3 gap-4">
            {filteredPosts.map((post: PostType) => (
              <div key={post.id} className="bg-gray-300 rounded-lg p-4 flex flex-col justify-between">
                <div>
                  <p className="font-bold text-lg">{formatDate(post.createdAt)}</p>
                  <ul className="mt-2 flex flex-col gap-1">
                    {post.exerciseEntries.map((exerciseEntry, i) => (
                      <li key={exerciseEntry.id} className="flex gap-1 flex-wrap text-sm">
                        <b>{i + 1}.</b><span className="block w-11 bg-teal-500 text-white text-sm font-medium flex items-center justify-center">{bodyPartsMap[exerciseEntry.bodyPart]}</span><span>{exercisesMap[exerciseEntry.exercise]}</span><span className="flex gap-1"><span>{exerciseEntry.weight}kg</span><span>×</span><span>{exerciseEntry.repetitions}回</span></span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 mb-1 text-right">
                  <Link href={`/post/${post.id}`} className="bg-pink-500 px-3 py-2 rounded-md text-white text-sm font-medium transition duration-500 hover:bg-pink-600">詳細を見る</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">データがありません</p>
        )}
      </div>
    </main >
  );
};

export default BodyPartList;
