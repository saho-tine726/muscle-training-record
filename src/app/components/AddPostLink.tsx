import Link from "next/link"

export const AddPostLink = () => {
  return (
    <div className="mb-6">
      <Link href="/post/add" className="bg-red-600 px-3 sm:px-4 py-2 rounded-md text-white text-md font-medium transition duration-500 hover:bg-red-700">本日のトレーニングを追加する</Link>
    </div>
  )
}
