import Link from "next/link"

const AllPostLink = () => {
  return (
    <div className="mb-6">
      <Link href="/post/add" className="bg-red-600 px-3 md:px-4 py-2 rounded-md text-white text-sm md:text-md font-medium transition duration-500 hover:bg-red700">本日のトレーニング追加ページへ</Link>
    </div>
  )
}

export default AllPostLink