import Link from "next/link";

const BodyPartList = () => {
  const bodyParts = [
    "CHEST", "BACK", "LEGS", "SHOULDERS", "ARMS"
  ];

  return (
    <main className="max-w-[1000px] mx-auto py-6">
      <div className="px-6 py-10 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-2 text-center">BodyPart ごとのトレーニング一覧</h1>
        <div className="grid grid-cols-3 gap-6">
          {bodyParts.map(part => (
            <Link
              key={part}
              href={`/exercise-entries?bodyPart=${part}`}
              className="bg-teal-500 px-3 py-2 rounded-md text-white text-md font-medium text-center"
            >
              {part}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default BodyPartList;
